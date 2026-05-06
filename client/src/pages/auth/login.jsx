import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { requestStart, setUser, authError } from "../../store/auth-slice/index";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(requestStart());

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                // Save user data & token in Redux and localStorage
                dispatch(setUser({ 
                    user: data.user, 
                    role: data.user.role, 
                    token: data.token 
                }));

                localStorage.setItem("authUser", JSON.stringify(data.user));
                localStorage.setItem("authToken", data.token);

                console.log("User after login:", data.user); 
            
                alert("Login Successful!");

                // Navigate based on user role
                if (data.user.role === "admin") {
                    navigate("/admin/dashboard");  // Redirect admin to admin dashboard
                } else {
                    navigate("/shop/home"); // Redirect user to shop home
                }

            } else {
                dispatch(authError(data.message));
                alert(data.message);
            }
        } catch (error) {
            dispatch(authError("Something went wrong"));
            console.error("Login error:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Email"
                        className="w-full px-4 py-3 border rounded-lg mb-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        className="w-full px-4 py-3 border rounded-lg mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg">
                        Login
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    New here?{" "}
                    <Link to="/auth/register" className="text-blue-500 font-semibold">Create an account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
