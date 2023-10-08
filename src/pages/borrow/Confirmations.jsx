import React, {useContext} from "react";
import SuccessConfirm from "./SuccessConfirm";
import ErrorConfirm from "./ErrorConfirm";
import {useNavigate } from "react-router-dom";
import { useBorrow } from "../../contexts/borrowContext/borrowContext";

function Confirmations({_generateRes}) {
  const navigate = useNavigate();
  const {handleGenerateSTCBack, confirm} = useBorrow();

 //handles redirection to dashboard in 3 seconds
 const dashboardRedirect = () => {
  if(confirm) {
    setTimeout(() => {
      navigate("/dashboard");
     }, 5000)
  }
 }

 //handles redirection to vault in 5 seconds
 const vaultRedirect = () => {
  if(confirm) {
    setTimeout(() => {
      handleGenerateSTCBack();
  }, 5000)
  }
 }


  return (
    <div>
      {
      _generateRes ? <SuccessConfirm _redirect={dashboardRedirect} />
      : 
      <ErrorConfirm _redirect={vaultRedirect} />
      }
    </div>
  );
}

export default Confirmations;
