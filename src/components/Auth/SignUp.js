import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import { addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
const Auth = () => {
  const [data, setData] = useState({});

  const navigate = useNavigate();
  const auth = getAuth();

  const handelInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  console.log(data);

  const { dispatch } = useContext(AuthContext);

  // const handleSignup = (event) => {
  //   event.preventDefault();

  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       dispatch({ type: "LOGIN", payload: user });
  //       navigate("/dashboard");
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ..
  //     });
  // };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      console.log(res.user);

      await setDoc(doc(db, "users", res.user.uid), {
        ...data,
        timeStamp: serverTimestamp(),
      });

      const userDetails = res.user;
      dispatch({ type: "LOGIN", payload: userDetails });
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      <section id="authsignup">
        <div className="form">
          <h2>SignUp</h2>
          <form onSubmit={handleAdd}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              required
              name="name"
              placeholder="Your Name"
              onChange={handelInput}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              required
              name="email"
              placeholder="Your Email"
              onChange={handelInput}
            />

            <label htmlFor="location">Place</label>
            <input
              type="text"
              id="location"
              required
              name="location"
              placeholder="Location (City)"
              onChange={handelInput}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              name="password"
              placeholder="Password"
              onChange={handelInput}
            />
            <button className="form-signup-btn">Signup</button>

            <p className="form-para">
              Already Registered?{" "}
              <Link to="/auth/login">
                <u>
                  <strong>Login</strong>
                </u>
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Auth;
