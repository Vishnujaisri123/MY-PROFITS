import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    holdings: {
      gold: [
        {
          id: { type: Number, required: true },
          qty: { type: Number, default: 0 },
          buyPrice: { type: Number, default: 0 },
        },
      ],
      silver: [
        {
          id: { type: Number, required: true },
          qty: { type: Number, default: 0 },
          buyPrice: { type: Number, default: 0 },
        },
      ],
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
