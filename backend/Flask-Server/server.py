from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from dotenv import load_dotenv


import datetime
import os

app = Flask(__name__)
CORS(app, origins="http://localhost:5173", supports_credentials=True)

# SQLAlchemy Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/feastit'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -------------------- Vendor Model --------------------
class Vendor(db.Model):
    __tablename__ = 'vendors'
    vendor_id = db.Column(db.Integer, primary_key=True)
    business_name = db.Column(db.String(100))
    vendor_name = db.Column(db.String(100))
    vendor_email = db.Column(db.String(100), unique=True)
    vendor_phone = db.Column(db.String(15))
    vendor_password = db.Column(db.String(100))
    vendor_description = db.Column(db.Text)
    vendor_taxId = db.Column(db.String(50))
    vendor_address = db.Column(db.Text)
    vendor_status = db.Column(db.String(20))
    vendor_rejectedmessage = db.Column(db.String(255))
    business_hours = db.Column(db.String(100))
    registration_cert = db.Column(db.String(255)) 
    supporting_docs = db.Column(db.String(255))       

# -------------------- Vendor Login --------------------
@app.route("/vendorLogin", methods=["POST"])
def vendor_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    vendor = Vendor.query.filter_by(vendor_email=email, vendor_password=password).first()
    if vendor:
        return jsonify({"message": "Vendor logged in successfully", "vendor_id": vendor.vendor_id, "vendor_status": vendor.vendor_status, "vendor_name": vendor.vendor_name, "vendor_rejectedmessage": vendor.vendor_rejectedmessage}), 200
    return jsonify({"error": "Invalid email or password"}), 401


@app.route("/register", methods=["POST"])
def register_vendor():
    data = request.form
    files = request.files

    # Check if email already exists
    existing_vendor = Vendor.query.filter_by(vendor_email=data.get("vendor_email")).first()
    if existing_vendor:
        return jsonify({"error": "Email already registered. Please use a different email address."}), 400

    # Combine first name and last name to form vendor_name if needed
    vendor_name = data.get("vendor_name")
    if not vendor_name:
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")
        vendor_name = f"{first_name} {last_name}".strip()
   
    # Save uploaded files
    upload_folder = os.path.join(os.getcwd(), "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    reg_filename = ""
    support_filename = ""

    if "vendor_registrationcertificate" in files:
        reg_file = files["vendor_registrationcertificate"]
        reg_filename = reg_file.filename
        reg_file.save(os.path.join(upload_folder, reg_filename))  

    if "vendor_supportingdocument" in files:
        support_file = files["vendor_supportingdocument"]
        support_filename = support_file.filename
        support_file.save(os.path.join(upload_folder, support_filename))  
    
    new_vendor = Vendor(
        business_name=data.get("business_name"),
        vendor_name=vendor_name,
        vendor_email=data.get("vendor_email"),
        vendor_phone=data.get("vendor_phone"),
        vendor_password=data.get("vendor_password"),
        vendor_description=data.get("vendor_description"),
        vendor_taxId=data.get("vendor_taxId"),
        vendor_address=data.get("vendor_address"),
        vendor_status="pending",
        vendor_rejectedmessage="",
        business_hours=data.get("business_hours", ""),
        registration_cert=reg_filename,  
        supporting_docs=support_filename 
    )

    try:
        db.session.add(new_vendor)
        db.session.commit()

        return jsonify({
            "message": "Vendor registered successfully",
            "vendor_id": new_vendor.vendor_id,
            "vendor_name": new_vendor.vendor_name,
            "vendor_status": new_vendor.vendor_status
        }), 200
    except Exception as e:
        db.session.rollback()
        # Check if it's a duplicate email error
        if "Duplicate entry" in str(e) and "vendor_email" in str(e):
            return jsonify({"error": "Email already registered. Please use a different email address."}), 400
        else:
            return jsonify({"error": f"Registration failed: {str(e)}"}), 500
# -------------------- Order api's--------------------

@app.route("/api/vendor/<int:vendor_id>/orders", methods=["GET"])
def get_vendor_orders_grouped(vendor_id):
    query = text("""
        SELECT 
            o.order_id,
            o.order_status,
            o.total_amount,
            m.item_name,
            oi.quantity
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN menu_items m ON oi.item_id = m.item_id
        WHERE o.vendor_id = :vendor_id;
    """)

    results = db.session.execute(query, {'vendor_id': vendor_id}).fetchall()

    grouped_orders = {}
    for row in results:
        order_id = row.order_id
        item_name = row.item_name
        item_quantity = row.quantity
        order_status = row.order_status
        total_amount = float(row.total_amount)

        if order_id not in grouped_orders:
            grouped_orders[order_id] = {
                "order_status": order_status,
                "total_amount": total_amount,
                "items": []
            }

        grouped_orders[order_id]["items"].append({
            "item_name": item_name,
            "item_quantity": item_quantity
        })

    # Transform the grouped data
    transformed = []
    for order_id, data in grouped_orders.items():
        order = {
            "order_id": order_id,
            "order_status": data["order_status"],
            "total_amount": data["total_amount"]
        }
        for i, item in enumerate(data["items"], start=1):
            order[f"item_name[{i}]"] = item["item_name"]
            order[f"item_quantity[{i}]"] = item["item_quantity"]
        transformed.append(order)

    return jsonify({"grouped_orders": transformed}), 200


@app.route("/api/vendor/<vendor_id>/orders/<order_id>/status", methods=["POST"])
def update_order_status(vendor_id, order_id):
    data = request.get_json()
    new_status = data.get("status")
    cancel_reason = data.get("cancel_reason", "")
    
    allowed_statuses = ["pending", "confirmed", "preparing", "out for delivery", "delivered", "cancelled"]
    
    if not new_status:
        return jsonify({"error": "Missing status"}), 400
    
    if new_status not in allowed_statuses:
        return jsonify({"error": f"Invalid status. Allowed: {allowed_statuses}"}), 400
    
    # If status is cancelled, require a reason
    if new_status == "cancelled" and not cancel_reason:
        return jsonify({"error": "Cancellation reason is required"}), 400
    
    # Update the order status
    update_query = text("""
    UPDATE orders
    SET order_status = :new_status
    WHERE order_id = :order_id AND vendor_id = :vendor_id
    """)
    
    result = db.session.execute(
        update_query, 
        {"new_status": new_status, "order_id": order_id, "vendor_id": vendor_id}
    )
    
    # Add entry to order_status_history
    if new_status == "cancelled":
        # For cancelled status, include the reason
        history_query = text("""
        INSERT INTO order_status_history (order_id, status, status_time, reason)
        VALUES (:order_id, :status, NOW(), :reason)
        """)
        
        db.session.execute(
            history_query,
            {"order_id": order_id, "status": new_status, "reason": cancel_reason}
        )
    else:
        # For other status changes, just record the change without reason
        history_query = text("""
        INSERT INTO order_status_history (order_id, status, status_time)
        VALUES (:order_id, :status, NOW())
        """)
        
        db.session.execute(
            history_query,
            {"order_id": order_id, "status": new_status}
        )
    
    db.session.commit()
    
    if result.rowcount == 0:
        return jsonify({"error": "Order not found or already has this status"}), 404
    
    return jsonify({"message": f"Order {order_id} status updated to {new_status}."}), 200



# get pending orders count

@app.route("/api/vendor/<int:vendor_id>/pending-orders-count", methods=["GET"])
def get_pending_orders_count(vendor_id):
    query = text("""
        SELECT COUNT(*) as pending_count
        FROM orders
        WHERE vendor_id = :vendor_id AND order_status = 'pending'
    """)
    
    result = db.session.execute(query, {'vendor_id': vendor_id}).fetchone()
    
    return jsonify({
        "pending_count": result.pending_count if result else 0
    }), 200


# -------------------- MenuItem Model --------------------
class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    item_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.vendor_id'), nullable=False)
    item_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    price = db.Column(db.Numeric(10, 2))
    nutritional_info = db.Column(db.Text)
    availability = db.Column(db.Boolean, default=True)

# -------------------- Get Menu Items for Vendor --------------------
@app.route("/vendor/<int:vendor_id>/menu", methods=["GET"])
def get_menu_items(vendor_id):
    items = MenuItem.query.filter_by(vendor_id=vendor_id).all()
    result = [{
        "item_id": item.item_id,
        "item_name": item.item_name,
        "description": item.description,
        "category": item.category,
        "price": float(item.price),
        "nutritional_info": item.nutritional_info,
        "availability": item.availability
    } for item in items]
    return jsonify(result), 200

# -------------------- Add New Menu Item --------------------
@app.route("/vendor/<int:vendor_id>/menu", methods=["POST"])
def add_menu_item(vendor_id):
    data = request.json
    new_item = MenuItem(
        vendor_id=vendor_id,
        item_name=data.get("item_name"),
        description=data.get("description"),
        category=data.get("category"),
        price=data.get("price"),
        nutritional_info=data.get("nutritional_info", ""),
        availability=data.get("availability", True)
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"message": "Item added successfully", "item_id": new_item.item_id}), 201

# -------------------- Update Menu Item --------------------
@app.route("/vendor/<int:vendor_id>/menu/<int:item_id>", methods=["PUT"])
def update_menu_item(vendor_id, item_id):
    data = request.json
    item = MenuItem.query.filter_by(vendor_id=vendor_id, item_id=item_id).first()
    if not item:
        return jsonify({"error": "Item not found"}), 404

    item.item_name = data.get("item_name", item.item_name)
    item.description = data.get("description", item.description)
    item.category = data.get("category", item.category)
    item.price = data.get("price", item.price)
    item.nutritional_info = data.get("nutritional_info", item.nutritional_info)
    item.availability = data.get("availability", item.availability)
    db.session.commit()
    return jsonify({"message": "Item updated successfully"}), 200

# -------------------- Delete Menu Item --------------------
@app.route("/vendor/<int:vendor_id>/menu/<int:item_id>", methods=["DELETE"])
def delete_menu_item(vendor_id, item_id):
    item = MenuItem.query.filter_by(vendor_id=vendor_id, item_id=item_id).first()
    if not item:
        return jsonify({"error": "Item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted successfully"}), 200


# -------------------- Vendor Profile Endpoints --------------------

# -------------------- Vendor Profile Management --------------------

# -------------------- Vendor Profile GET & UPDATE --------------------

@app.route('/vendor/<int:vendor_id>', methods=['GET'])
def get_vendor_profile(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({"error": "Vendor not found"}), 404

    return jsonify({
        "vendor_id": vendor.vendor_id,
        "vendor_name": vendor.vendor_name,
        "vendor_email": vendor.vendor_email,
        "vendor_phone": vendor.vendor_phone,
        "business_name": vendor.business_name,
        "vendor_address": vendor.vendor_address,
        "business_hours": vendor.business_hours
    })

@app.route('/vendor/<int:vendor_id>', methods=['PUT'])
def update_vendor_profile(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({"error": "Vendor not found"}), 404

    data = request.get_json()

    vendor.vendor_name = data.get('vendor_name', vendor.vendor_name)
    vendor.vendor_email = data.get('vendor_email', vendor.vendor_email)
    vendor.vendor_phone = data.get('vendor_phone', vendor.vendor_phone)
    vendor.business_name = data.get('business_name', vendor.business_name)
    vendor.vendor_address = data.get('vendor_address', vendor.vendor_address)
    vendor.business_hours = data.get('business_hours', vendor.business_hours)

    db.session.commit()
    return jsonify({"message": "Vendor profile updated successfully"})

#-----Update password\
@app.route('/vendor/<int:vendor_id>/update-password', methods=['PUT'])
def update_password(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({"error": "Vendor not found"}), 404

    data = request.get_json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if vendor.vendor_password != current_password:
        return jsonify({"error": "Incorrect current password"}), 400

    vendor.vendor_password = new_password
    db.session.commit()
    return jsonify({"message": "Password updated successfully"})

#-----------------------Vendor analytics---
@app.route("/vendor/<int:vendor_id>/analytics", methods=["GET"])
def get_vendor_analytics(vendor_id):
    # Check if vendor exists
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({"error": "Vendor not found"}), 404
    
    # Calculate total orders
    orders_query = text("""
        SELECT COUNT(*) as total_orders
        FROM orders
        WHERE vendor_id = :vendor_id
    """)
    total_orders_result = db.session.execute(orders_query, {"vendor_id": vendor_id}).fetchone()
    total_orders = total_orders_result.total_orders if total_orders_result else 0
    
    # Calculate total revenue
    revenue_query = text("""
        SELECT COALESCE(SUM(total_amount), 0) as total_revenue
        FROM orders
        WHERE vendor_id = :vendor_id
    """)
    revenue_result = db.session.execute(revenue_query, {"vendor_id": vendor_id}).fetchone()
    total_revenue = float(revenue_result.total_revenue) if revenue_result and revenue_result.total_revenue else 0.0
    
    # Calculate average order value
    avg_order_query = text("""
        SELECT COALESCE(AVG(total_amount), 0) as avg_order_value
        FROM orders
        WHERE vendor_id = :vendor_id
    """)
    avg_order_result = db.session.execute(avg_order_query, {"vendor_id": vendor_id}).fetchone()
    avg_order_value = float(avg_order_result.avg_order_value) if avg_order_result and avg_order_result.avg_order_value else 0.0
    
    # Count total menu items
    menu_items_query = text("""
        SELECT COUNT(*) as total_menu_items
        FROM menu_items
        WHERE vendor_id = :vendor_id
    """)
    menu_items_result = db.session.execute(menu_items_query, {"vendor_id": vendor_id}).fetchone()
    total_menu_items = menu_items_result.total_menu_items if menu_items_result else 0
    
    # Count unique customers
    customers_query = text("""
        SELECT COUNT(DISTINCT customer_id) as total_customers
        FROM orders
        WHERE vendor_id = :vendor_id
    """)
    customers_result = db.session.execute(customers_query, {"vendor_id": vendor_id}).fetchone()
    total_customers = customers_result.total_customers if customers_result else 0
    
    # Calculate average rating
    rating_query = text("""
        SELECT COALESCE(AVG(rating), 0) as avg_rating
        FROM customer_reviews
        WHERE vendor_id = :vendor_id
    """)
    rating_result = db.session.execute(rating_query, {"vendor_id": vendor_id}).fetchone()
    avg_rating = float(rating_result.avg_rating) if rating_result and rating_result.avg_rating else None
    
    return jsonify({
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "avg_order_value": avg_order_value,
        "total_menu_items": total_menu_items,
        "total_customers": total_customers,
        "avg_rating": avg_rating
    }), 200


# -------------------- Health Check --------------------
@app.route("/")
def index():
    return jsonify({"message": "Vendor API is running."})

# Add this new endpoint after your existing vendor login endpoint
@app.route("/check-email-exists", methods=["POST"])
def check_email_exists():
    data = request.get_json()
    email = data.get("email")
    
    if not email:
        return jsonify({"exists": False, "error": "Email is required"}), 400
    
    # Check if the email exists in your vendors table
    vendor = Vendor.query.filter_by(vendor_email=email).first()
    
    if vendor:
        return jsonify({"exists": True}), 200
    else:
        return jsonify({"exists": False, "error": "Email not registered with us"}), 404

# Add this endpoint for the actual password reset
@app.route("/reset-vendor-password", methods=["POST"])
def reset_vendor_password():
    data = request.get_json()
    email = data.get("email")
    new_password = data.get("new_password")
    
    if not email or not new_password:
        return jsonify({"error": "Email and new password are required"}), 400
    
    # Find the vendor by email
    vendor = Vendor.query.filter_by(vendor_email=email).first()
    
    if not vendor:
        return jsonify({"error": "Vendor not found"}), 404
    
    # Update the password
    vendor.vendor_password = new_password
    
    try:
        db.session.commit()
        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update password: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
