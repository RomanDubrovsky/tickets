class LockManager {
  constructor() {
    this.locks = new Map(); // key: "eventId:seatId", value: { holdId, expiresAt }
  }

  // Returns true if successfully locked, false if already locked
  holdSeat(eventId, seatId, holdId, ttlMinutes = 15) {
    this._cleanupExpiredLocks();
    const key = `${eventId}:${seatId}`;
    
    if (this.locks.has(key)) {
      return false; // Already locked
    }

    const expiresAt = new Date(Date.now() + ttlMinutes * 60000);
    this.locks.set(key, { holdId, expiresAt });
    return expiresAt;
  }

  // Releases a lock if the holdId matches
  releaseHold(eventId, seatId, holdId) {
    const key = `${eventId}:${seatId}`;
    const lock = this.locks.get(key);
    
    if (lock && lock.holdId === holdId) {
      this.locks.delete(key);
      return true;
    }
    return false;
  }

  // Checks if a seat is currently locked by someone else
  isSeatLocked(eventId, seatId) {
    this._cleanupExpiredLocks();
    const key = `${eventId}:${seatId}`;
    return this.locks.has(key);
  }

  // Get all currently locked seats for an event
  getLockedSeats(eventId) {
    this._cleanupExpiredLocks();
    const lockedSeats = [];
    for (const [key, lock] of this.locks.entries()) {
      if (key.startsWith(`${eventId}:`)) {
        const seatId = key.split(':')[1];
        lockedSeats.push(seatId);
      }
    }
    return lockedSeats;
  }

  _cleanupExpiredLocks() {
    const now = new Date();
    for (const [key, lock] of this.locks.entries()) {
      if (lock.expiresAt < now) {
        this.locks.delete(key);
      }
    }
  }
}

export default new LockManager();
