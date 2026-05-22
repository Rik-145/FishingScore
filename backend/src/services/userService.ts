import bcrypt                                                                          from 'bcrypt';
import { ChangePasswordInput, DeactivateAccountInput, PublicUser, UpdateProfileInput } from "../types/user";
import * as userRepository                                                             from "../repositories/userRepository";

function validateUsername(username: string): void {
    if (username.length < 3) {
        throw new Error("Username must have at least 3 characters");
    }
}

function validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new Error('Invalid email');
    }
}

function validatePassword(password: string): void {
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }
}

export async function updateProfile(userId: number, input: UpdateProfileInput): Promise<PublicUser> {
    const username = input.username?.trim();
    const email = input.email?.trim().toLowerCase();

    if (username !== undefined) {
        validateUsername(username);
    }

    if (email !== undefined) {
        validateEmail(email);

        const existingUser = await userRepository.findUserByEmail(email);

        if (existingUser && existingUser.id !== userId) {
            throw new Error("Email is already in use");
        }
    }

    const user = await userRepository.updateUserProfile(userId, { username, email });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export async function changePassword(userId: number, input: ChangePasswordInput): Promise<void> {
    validatePassword(input.new_password);

    const user = await userRepository.findPublicUserById(userId);

    if (!user || !user.is_active) {
        throw new Error("User not found");
    }

    const userWithPassword = await userRepository.findUserByEmail(user.email);

    if (!userWithPassword) {
        throw new Error("User not found");
    }

    const passwordMatches = await bcrypt.compare(
        input.current_password,
        userWithPassword.password_hash
    );

    if (!passwordMatches) {
        throw new Error("Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(input.new_password, 10);

    await userRepository.updateUserPassword(userId, passwordHash);
}

export async function deactivateAccount(userId: number, input: DeactivateAccountInput): Promise<void> {
    const user = await userRepository.findPublicUserById(userId);

    if (!user || !user.is_active) {
        throw new Error("User not found");
    }

    const userWithPassword = await userRepository.findUserByEmail(user.email);

    if (!userWithPassword) {
        throw new Error("User not found");
    }

    const passwordMatches = await bcrypt.compare(
        input.current_password,
        userWithPassword.password_hash
    );

    if (!passwordMatches) {
        throw new Error("Current password is incorrect");
    }

    const deactivated = await userRepository.deactivateUser(userId);

    if (!deactivated) {
        throw new Error("User not found");
    }
}