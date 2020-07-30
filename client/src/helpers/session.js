import axios from "axios";
import jwtDecode from "jwt-decode";

export const getCurrentUser = () => {
  if (typeof localStorage !== "undefined") {
    const token = localStorage.getItem("token");

    if (token !== null) {
      const data = jwtDecode(token);
      //todo: verify the token beforehand
      return data;
    } else {
      //todo: maybe something else to handle this null return. depends on the context this is usually used in
      //todo: possible combine w/getStored by returning object with property and token
      alert("Error with retrieving current user. Please relog and try again.");
      return null;
    }
  } else {
    // const defaultUser = {
    //   email: "N/A",
    //   fName: "N/A",
    //   lName: "N/A",
    //   city: "Gainesville",
    //   phone: "N/A",
    //   isWasher: false,
    //   isDriver: false,
    //   isAdmin: false,
    // };
    alert(
      "Error with retrieving current user. Please make sure localStorage is enabled, relog, and try again."
    );
    return null;
  }
};
