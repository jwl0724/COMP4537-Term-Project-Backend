const reset = async function(req, res, db) {
    try {
        const { email, newPassword } = req.body;
        const user = await db.getUser(email);
        if (!user) return res.status(404).json({ error: "User not found" });

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.writeUser(email, hashedPassword);
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.reset = reset;