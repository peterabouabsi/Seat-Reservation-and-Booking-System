# Solution: Seat Reservation and Booking System

## 🔧 How the Solution Works

The system uses three main API endpoints (`Reserve` → `Pay` → `Confirm`) working together to handle seat booking safely:

> **Note:** For this task, we pass `customerId` through the request body.

1. **POST /api/events/{eventId}/seats/reserve**  
   - User selects seats to reserve for an event.  
   - The system checks seat availability (not taken, not locked by others).  
   - Locks the seats for the user (`lockedBy`, `lockedUntil`).  
   - Creates an **Order** with status `Pending`, associating the seats and customer.

2. **POST /api/orders/{orderId}/pay**  
   - Simulates payment processing for the order.  
   - On success, updates the Order status to `Paid`.

3. **POST /api/events/{eventId}/seats/confirm**  
   - Confirms the booking for a paid order.  
   - Creates a **Reservation** linking customer, event, seats, and order.  
   - Marks seats as `isTaken = true` and clears locks (`lockedBy`, `lockedUntil`).

## ✅ How It Solves the Problem

- **Prevents double booking:** seats are locked during payment to avoid concurrent selection.  
- **Ensures data integrity:** only seats locked under a `Pending` order can be confirmed after payment.  
- **Supports async payment flows:** payment and confirmation are separate steps, accommodating real-world gateways.  
- **Makes seat status clear:** once confirmed, seats are permanently taken and unavailable.

## 🌍 Real-World Use

- User selects seats → `/reserve` locks seats and creates a pending order.  
- User completes payment via external gateway → `/pay` updates order to paid.  
- Backend confirms booking → `/confirm` creates reservation and finalizes seat status.  
- Locked seats expire after timeout if no payment occurs, freeing them for others.

## 🧪 Try It on Swagger

You can test the API endpoints in Swagger by providing actual IDs:

```
Customer Ids: [6848509d75825a9f079930db, 684918379fe8e0bfd4da1ca7]
Event Ids: [684940977cf42c59e68c2125, 6849476a7cf42c59e68c2126]
```