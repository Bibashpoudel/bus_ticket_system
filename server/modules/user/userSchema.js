const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    gender: { type: String, required: false },
    dob: { type: String, required: false },
    role: {
      type: String,
      enum: [
        "super-admin",
        "admin",
        "bus-owner",
        "bus-manager",
        "bus-counter",
        "validator",
        "customer",
        "bus-company",
      ],
    },
    account_verified: { type: Boolean, default: true },
    last_login_at: { type: Date, default: Date.now() },
    isActive: { type: Boolean, default: true },
    auth_provider: { type: String, default: "" },
    phone: { type: String, default: "" },
    otp_verified: { type: Boolean, required: true, default: false },
    calling_code: { type: String, required: false, default: "+251" },
    image: { type: String, required: false },
    bus_image: { type: String, required: false },
    fcm_token: { type: String, required: false },
    added_by: { type: mongoose.Schema.Types.ObjectId },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  if (!candidatePassword || !this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual("permission", {
  ref: "Permission",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
});

userSchema.virtual("company", {
  ref: "Company",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
});

// tell Mongoose to retrieve the virtual fields
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
