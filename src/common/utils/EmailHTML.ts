import { Service } from "typedi";

@Service()
export class EmailHTML {
	sendPasswordToUser(
		firstname: string,
		lastName: string,
		tempPassword: string
	) {
		return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Temporary Password Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #333;
        }
        p {
          color: #666;
        }
        
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Temporary Password Email</h2>
        <p>Hello ${firstname + " " + lastName},</p>
        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
        <p>Please use this temporary password to log in to your account. We recommend changing your password after logging in.</p>
    
        <p>Thank you,</p>
        <p>GO LOGO</p>
        
      </div>
    </body>
    </html>`;
	}

	sendOrderToCustomer(firstName: string, lastName: string, order: any) {
		return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #333;
        }
        p {
          color: #666;
        }
        .order-details {
          border-collapse: collapse;
          width: 100%;
          margin-top: 20px;
        }
        .order-details th, .order-details td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .order-total {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Order Confirmation</h2>
        <p>Hello ${firstName + " " + lastName},</p>
        <p>Thank you for your order! We have received the following details:</p>
    
    
        <p class="order-total">Order Total: &#8377; ${order.totalPrice}</p>
            <p class="order-total">Total Items : ${
							order.totalQuantity
						} Gallons</p>    
        <p>Your order is confirmed, and it will be shipped soon.</p>
    
        <p>If you have any questions or concerns about your order, please contact our customer support.</p>
    
        <p>Thank you for shopping with us!</p>
        <p>GO LOGO</p>
      </div>
    </body>
    </html>`;
	}

	sendUpdatedOrderToCustomer(firstName: string, lastName: string, order: any) {
		return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Update Order Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #333;
        }
        p {
          color: #666;
        }
        .order-details {
          border-collapse: collapse;
          width: 100%;
          margin-top: 20px;
        }
        .order-details th, .order-details td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .order-total {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Order Updated !</h2>
        <p>Hello ${firstName + " " + lastName},</p>
        <p>Thank you for your order! We have received the following details:</p>
    
    
        <p class="order-total">Order Total: &#8377; ${order.totalPrice}</p>
            <p class="order-total">Total Items : ${
							order.totalQuantity
						} Gallons</p>    
        <p>Your order is updated and  confirmed, and it will be shipped soon.</p>
    
        <p>If you have any questions or concerns about your order, please contact our customer support.</p>
    
        <p>Thank you for shopping with us!</p>
        <p>GO LOGO</p>
      </div>
    </body>
    </html>`;
	}

	sendPickedUpToCustomer(customer: any, partner: any, order: any) {
		return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Picked Up</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
    
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    
        h2 {
          color: #333333;
        }
    
        p {
          color: #666666;
        }
    
        .button {
          display: inline-block;
          padding: 10px 20px;
          text-decoration: none;
          background-color: #3498db;
          color: #ffffff;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Your Order has been Picked Up!</h2>
        <p>Dear ${customer.firstName + " " + customer.lastName},</p>
        <p>We are excited to inform you that your order has been picked up by our delivery partner and is on its way to you.</p>
        <p><strong>Order Details:</strong></p>
        <ul>
          <li><strong>Order Number:</strong> ${order._id}</li>
          
          <li><strong>Delivery Partner:</strong> ${
						partner.firstName + " " + partner.lastName
					}</li>
          <li><strong>Amount to be Paid:</strong> ${order.totalPrice}</li>

    
        </ul>
        <p>You can track your order using the provided tracking information.</p>
        <p>Thank you for choosing us! If you have any questions or concerns, feel free to contact our customer support.</p>
        <p>Best regards,</p>
        <p>GO LOGO</p>
      </div>
    </body>
    </html>
    `;
	}

	sendDeliveredToCustomer(order: any, customer:any) {
		return "<h1>Your Order Has Been Delivered !<h1>";
	}
}
