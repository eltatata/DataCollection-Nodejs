import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

adminSchema.methods.comparePassword = function (password) {
    const match = bcrypt.compareSync(password, this.password);
    return match;
}

const Admin = mongoose.model('User', adminSchema);

export default Admin;