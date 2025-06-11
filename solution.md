# Solution: Seat Reservation and Booking System

## How the Solution Works

The system uses three main API endpoints (`Reserve` → `Pay` → `Confirm`) that work together to handle seat booking safely and reliably.

> **Note:** For test purposes, `customerId` is passed through the request body.

---

## Updated Database Models

### `Customers`
- `_id`: Unique customer ID 
- `firstName`: Customer’s first name
- `lastName`: Customer’s last name

### `Seats`
- `_id`: Unique seat identifier
- `eventID`: ID of the event the seat belongs to
- `name`: Seat label (e.g., "A1")
- `isTaken: boolean`: Indicates if the seat has been permanently booked
- `lockedBy: ObjectId | null`: ID of the customer currently locking the seat
- `lockedUntil: Date | null`: Timestamp indicating when the lock expires

### `Orders`
- `_id_`: Unique order identifier
- `customerID`: ID of the customer placing the order
- `seatIDs: string[]`: List of selected seat IDs
- `status: 'Pending' | 'Paid' | 'Failed'`: Current status of the order
- `amount`: Total amount for the order
- `currency`: Currency code (e.g., "USD", "EUR")

### `Reservations`
- `_id`: Unique reservation ID
- `customerID`: ID of the customer
- `eventID`: ID of the event
- `seatIDs: string[]`: List of reserved seat IDs
- `orderID`: Associated order ID

---

## API Endpoints

### 1. `POST /api/events/{eventId}/seats/reserve`
- User selects seats to reserve for an event.
- The system checks if the seats are available (not taken and not locked by others).
- Locks the selected seats (`lockedBy`, `lockedUntil`).
- Creates an **Order** with status `Pending`, associating the seats and customer.

### 2. `POST /api/orders/{orderId}/pay`
- Simulates payment processing for the order.
- On success, updates the order status to `Paid`.

### 3. `POST /api/events/{eventId}/seats/confirm`
- Confirms the booking for a paid order.
- Creates a **Reservation** linking the customer, event, seats, and order.
- Marks the selected seats as `isTaken = true` and clears any existing locks (`lockedBy`, `lockedUntil`).

---

## How It Solves the Problem

- **Prevents double booking:** Seats are locked during the payment phase to avoid simultaneous selection.
- **Ensures data integrity:** Only seats locked under a `Pending` order can be confirmed.
- **Supports async payment flows:** Payment and confirmation are handled in separate steps, suitable for real-world gateways.
- **Makes seat status clear:** Once confirmed, seats are marked as permanently booked and removed from future availability.

---

## Seat Lock Expiration

- Locked seats automatically expire after a set timeout (e.g., 10 minutes).
- A background job or TTL mechanism releases expired locks.
- This ensures unused locked seats are returned to the pool for others.

---

## Real-World Flow

- User selects seats → `/reserve` locks the seats and creates a pending order.
- User completes payment via an external gateway → `/pay` marks the order as paid.
- Backend confirms the booking → `/confirm` finalizes the seat reservation and status.
- If payment isn't completed in time, the seat lock expires and the seats become available again.

---

## Try It on Swagger on `/docs`

You can test the API endpoints using these test IDs:

```
Customer Ids: [6848509d75825a9f079930db, 684918379fe8e0bfd4da1ca7]
Event Ids: [684940977cf42c59e68c2125, 6849476a7cf42c59e68c2126]
```