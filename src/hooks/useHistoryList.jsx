// useHistoryList.js
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useHistoryList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);

  // Add the current location to the historyList
  useEffect(() => {
    //Check if historyList exists in local storage
    setHistoryList((prevHistory) => [...prevHistory, location.pathname]);
    localStorage.setItem("historyList", JSON.stringify(historyList));
  }, [location.pathname]);

  // Function to go back to a specific page in history
  const goToPage = (page) => {
    navigate(page);
  };

  return { historyList, goToPage };
}
