// Memory model structure for the application
// This defines the shape of memory documents in MongoDB

/**
 * Memory Schema:
 * - title: Title of the memory
 * - description: Description of the memory
 * - date: When the memory was created
 * - imageUrl: URL/Base64 of the uploaded image
 * - tags: Array of tag strings for categorizing memories
 * - createdAt: When the memory was added to the system
 * - updatedAt: When the memory was last updated
 */

const MemorySchema = {
  title: String, // Required
  description: String, // Required
  date: Date, // When the memory occurred
  imageUrl: String, // Required - base64 encoded image or URL
  tags: [String], // Array of tag strings for categorizing memories
  createdAt: Date, // When the memory was created in the system
  updatedAt: Date, // When the memory was last updated
};

export default MemorySchema;
