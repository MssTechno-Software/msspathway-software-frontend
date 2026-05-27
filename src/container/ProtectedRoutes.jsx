// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {

//     const token = localStorage.getItem("token");

//     if (!token) {
//         return <Navigate to="/login" replace />;
//     }

//     return children;
// }

// export default ProtectedRoute;

import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {

    const token = localStorage.getItem("token");

    const [sessionExpired, setSessionExpired] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        if (!token) return;

        try {

            const payload = JSON.parse(atob(token.split(".")[1]));

            const expiry = payload.exp * 1000;

            const currentTime = Date.now();

            if (currentTime > expiry) {

                localStorage.clear();

                setSessionExpired(true);
            }

        } catch (error) {

            console.log("Invalid token");

            localStorage.clear();

            setSessionExpired(true);
        }

    }, [token]);

    if (!token && !sessionExpired) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            {children}

            {/* SESSION EXPIRED POPUP */}
            {sessionExpired && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">

                    <div className="bg-white w-full max-w-xs sm:max-w-[320px] p-5 sm:p-6 rounded-lg shadow-lg text-center">

                        <h3 className="text-lg font-semibold mb-2 text-red-600">
                            Session Expired
                        </h3>

                        <p className="text-gray-600 text-sm">
                            Your session has expired. Please login again.
                        </p>

                        <button
                            onClick={() => {
                                setSessionExpired(false);
                                navigate("/login");
                            }}
                            className="mt-5 px-6 py-2 bg-green-800 text-white rounded-md hover:bg-green-700 text-sm cursor-pointer"
                        >
                            Login Again
                        </button>

                    </div>

                </div>
            )}
        </>
    );
}

export default ProtectedRoute;