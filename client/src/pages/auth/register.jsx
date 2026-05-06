import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { requestStart, authError } from "../../store/auth-slice/index";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        dispatch(requestStart());
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
                credentials: "include",
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Registration Successful! Please log in.");
                navigate("/auth/login"); // Redirecting to login page after registration
            } else {
                dispatch(authError(data.message));
                alert(data.message);
            }
        } catch (error) {
            dispatch(authError("Something went wrong"));
            console.error("Registration error:", error);
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                        className="w-full px-4 py-3 border rounded-lg mb-3"
                    />

                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        className="w-full px-4 py-3 border rounded-lg mb-3"
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        className="w-full px-4 py-3 border rounded-lg mb-3"
                    />

                    <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg">
                        Register
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-blue-500 font-semibold">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
