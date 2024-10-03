

export interface Cart {
  product: { type: Number, ref: 'Product', required: true }, // Reference to Product model
  quantity: { type: Number, required: true, default: 1 }, // Quantity of the product
}


export interface User {
  userId: number;                  // Unique identifier for the user
  username: string;            // User's name
  email: string;               // Email address
  password?: string;           // Password (optional for security reasons)
  firstName?: string;          // First name (optional)
  lastName?: string;           // Last name (optional)
  dateOfBirth?: Date;          // User's date of birth (optional)
  createdAt: Date;             // Timestamp for when the user was created
  updatedAt?: Date;            // Timestamp for when the user was last updated (optional)
  isActive: boolean;           // Status indicating if the user is active
  roles: string[];             // Array of roles assigned to the user (e.g., 'admin', 'user', etc.)
  profileImageUrl?: string;    // URL to the user's profile image (optional)
  cart: Cart[];                // Array of products in the user's cart
}
