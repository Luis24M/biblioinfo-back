import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  usuario: string;
  password: string;
  rol: string;
  estado: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, default: 'estudiante', enum: ['administrador', 'estudiante'] },
  estado: { type: Boolean, default: true }
});

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// indexes
UserSchema.index({ usuario: 1 }, { unique: true, name: 'unique_usuario' });

export const User = model<IUser>('User', UserSchema);
