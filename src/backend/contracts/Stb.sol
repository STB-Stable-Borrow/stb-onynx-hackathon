// Official contract for vault by mohzcrea8me

// SPDX-License-Identifier: MIT
pragma solidity >=0.5.11 < 0.9.0;
import {ISTC} from "./Stc.sol";

interface ISTB {
    struct Vault{
        uint256 id;
        address owner;
        uint256 interest;
        uint created_at;
        uint closed_at;
        uint256 col_ratio;
        uint256 lck_collateral;
        uint256 avail_collateral;
        uint256 debt;
        uint last_payment_at;
    }

   function getEquivalentSTC(uint256 amount) external view returns (uint);
   function getEquivalentCollateral(uint256 vault_id, uint256 amount) external view returns (uint);
   function getRegulatorFee(uint256 amount) external view returns (uint);
   function createVault(uint collateral_amt) external payable returns(bool);
   function allVaults() external view returns(Vault [] memory);
   function getVault(uint256 vault_id) external view returns(Vault memory);
   function getUserVaults(address account) external view returns (Vault [] memory);
   function getVaultColRatio(uint256 vault_id) external view returns(uint);
   function depositCollateral(uint vault_id) external payable returns (bool);
   function generateStc(uint256 vault_id, uint256 collateral_amt) external payable returns(bool);
   function withdrawCollateral(uint256 vault_id, uint256 amount) external  returns(bool);
   function debtDuration(uint256 vault_id) external view returns(uint);
   function debtInterest(uint256 vault_id) external view returns(uint);
   function vaultTotalDebt(uint256 vault_id) external view returns(uint);
   function payDebt(uint256 vault_id, uint256 amount) external  returns (bool);
   function updateMinimumColRatio(uint256 new_ratio) external  returns(bool);
   function totalVaults() external view returns(uint);
   function totalLockedCol() external view returns(uint); 
   function totalAvailableCol() external view returns(uint);
   function userTotalLockedCol(address account) external view returns(uint);
   function userTotalAvailableCol(address account) external view returns(uint); 
   function userTotalDebt(address account) external view returns(uint); 
   function inspectVault(uint256 vault_id) external returns(bool);
   function allVaultsInLiquidation() external view returns(Vault [] memory);
   function allHauntedVaults() external view returns(Vault [] memory);

}

contract STB {
    struct Vault{
        uint256 id;
        address owner;
        uint256 interest;
        uint created_at;
        uint closed_at;
        uint256 col_ratio;
        uint256 lck_collateral;
        uint256 avail_collateral;
        uint256 debt;
        uint last_payment_at;
    }
    Vault [] VaultList;
    uint256 public minimumColRatio;
    uint256 public interest;
    address public stcAddress;
    uint256 public regulatorPercentage;
    uint8 public maximumVaultPerUser;
    uint public interestDuration; // yearly most times(31556926)
    mapping (address => bool) public isAuthorized;
    address public admin;
    event VaultCreation(address vault_owner, uint256 vault_id, uint indexed time,  address indexed collateral, uint256 amount);
    event VaultClosure(address vault_owner, uint256 vault_id, uint time, address reporter, uint256 indexed commision);


    constructor(address stc_address, uint256 col_ratio, uint256 reg_perc, uint256 intr, uint intr_duration, uint8 max_vault) {
        minimumColRatio = col_ratio;
        interest = intr;
        interestDuration = intr_duration;
        stcAddress = stc_address;
        regulatorPercentage = reg_perc;
        maximumVaultPerUser = max_vault;
        admin = msg.sender;
    }
    
    //-------MATH(LIKE SAFEMATH)----
    function add(uint a, uint b) internal pure returns (uint c) {
        require((c = a + b) >= a, "MATH_ERR_1: math addition failed");
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require((c = a - b) <= a, "MATH_ERR_2: math substration failed");
    }
    //------MODIFIERS---------
    modifier validateOwner(uint256 vault_id) {
        address vault_owner = getVault(vault_id).owner;
        require(vault_owner == msg.sender, "STB-ERR_1: Only vault owner can call this function");
        _;
    }

    modifier validateAmountReceived(uint amount) {
        require(msg.value > 0, "STB-ERR_2: Amount sent must be greater than zero(0)");
        require(amount > 0, "STB-ERR_3: Amount inputed is lesser than than zero(0)");
        require(msg.value >=  amount, "STB-ERR_4: Amount sent is lesser than inputed amount");
        _;
    }

    modifier validateLiquidation(uint256 vault_id) {
       if (getVault(vault_id).debt > 0) {
            require(getVault(vault_id).col_ratio >= minimumColRatio, "STB-ERR_5: This vault is in liquidation");
       }
        _;
    }

    modifier validateVault(uint256 vault_id) {
        require(getVault(vault_id).created_at > 0, "STB-ERR_6: Vault with this id does not exist");
        require(getVault(vault_id).closed_at == 0, "STB-ERR_7: Vault with this id has been closed");
        require(getVault(vault_id).col_ratio == getVaultColRatio(vault_id), "STB-ERR_23: This vault seems suspicious, vault activities are suspended");
        _;
    }

    modifier validateAvailableBalance(uint256 vault_id, uint256 amount) {
        require(amount > 0, "STB-ERR_3: Amount inputed is lesser than than zero(0)");
        require(getVault(vault_id).avail_collateral >= amount, "STB-ERR_8: Insufficient collateral balance");
        _;
    }
   

    modifier validateMaxVault() {
        uint lst_vault_pstn = sub(maximumVaultPerUser, 1);
        require(getUserVaults(msg.sender)[lst_vault_pstn].id == 0, "STB-ERR_9: Maximum number of vaults reached");
        _;
    }

    modifier validateIsAdmin() {
        require(msg.sender == admin, "STB-ERR_10: Only contract admin can call this function");
        _;
    }


    modifier validateNotAdmin(address account) {
        require(account != admin, "STC-ERR_11: Can't unauthorize contract admin");
        _;
    }

    modifier validateAddress(address account) {
        require(account != address(0), "STC-ERR_12: Invalid address passed");
        _;
    }


    modifier validateAuthorization() {
        require(isAuthorized[msg.sender], "STB-ERR_13: Only authorized accounts can call this function");
        _;
    }

    modifier validateVaultInspection(uint256 vault_id) {
        require(getVault(vault_id).debt > 0, "STB-ERR_14: vault with this id doesn't have an outstanding debt");
        require(getVault(vault_id).col_ratio < minimumColRatio, "STB-ERR_15: vault with this id is not in liquidation");
        require(getVault(vault_id).lck_collateral > 0, "STB-ERR_16: vault's locked collateral is lesser than zero(0)");
        _;
    }

    modifier validateNewMaxVault(uint8 new_max) {
        require(new_max >= VaultList.length, "STB-ERR_19: max vault per user cannot be lesser than total vaults");
        _;
    }

    modifier validateMinimumColRatio(uint256 new_ratio) {
        require(new_ratio > minimumColRatio, "STB-ERR_20: minimum collateral ratio cannot be lesser than current minimum collateral ratio");
        _;
    }

    modifier validateRegulatorPerc(uint256 new_reg_perc) {
        require(new_reg_perc >= 1, "STB-ERR_21: new regulator percentage cannot be zero(0)");
        _;
    }

//------FUNCTIONS---------   
    
    function _createVault (uint256 lck_collateral_amt, uint256 equivalent_stc, uint256 balance) internal {
      uint256 newid = add(VaultList.length, 1);
      uint currentColRatio = (lck_collateral_amt * 1000000000000000000) / equivalent_stc;
      VaultList.push(Vault(newid, msg.sender, interest, block.timestamp, 0, currentColRatio, lck_collateral_amt, balance, equivalent_stc, 0));
      emit VaultCreation(msg.sender, newid, block.timestamp, stcAddress, lck_collateral_amt);
    }

    function _mintStc (uint256 amount) internal {
      ISTC istc = ISTC(stcAddress);
      istc.mint(msg.sender, amount);
    }

    function getEquivalentSTC(uint256 amount) public view returns (uint) {
        uint converted_amt = (amount * 1000000000000000000);
        return (converted_amt/minimumColRatio);
    }

    function getEquivalentCollateral(uint256 vault_id, uint256 amount) public view returns (uint) {
        uint collateral = amount * getVaultColRatio(vault_id);
        uint converted_collateral = collateral /1000000000000000000;
        return converted_collateral;
    }

    
    function getRegulatorFee(uint256 amount) public view returns (uint) {
       uint reg_fee = regulatorPercentage * amount;
       uint conv_reg_fee = reg_fee/1000000000000000000;
       return conv_reg_fee;
    }

    function createVault(uint collateral_amt) external payable validateAmountReceived(collateral_amt) validateMaxVault() returns(bool) {
        uint actual_amount = sub(collateral_amt, getRegulatorFee(collateral_amt));
        uint balance = sub(msg.value, collateral_amt);
        uint equivalent_stc = getEquivalentSTC(actual_amount);
        if (equivalent_stc > 0) {
            _createVault(collateral_amt, equivalent_stc, balance);
            _mintStc(equivalent_stc);
            return true;
        }else{
            revert("STB-ERR_22: Input collateral too small");
        }
    }


    function allVaults() external view returns(Vault [] memory) {
        return VaultList;
    }

    function getVault(uint256 vault_id) public view returns(Vault memory) {
        uint256 conv_vault_id = sub(vault_id, 1);
        return VaultList[conv_vault_id];
    }


    function getUserVaults(address account) public view returns (Vault [] memory) {
        Vault[] memory list = new Vault [](maximumVaultPerUser);
        for(uint i = 0; i < VaultList.length; i++) {
            if (VaultList[i].owner == account) {
               list[i] = VaultList[i];
            }
        }
        return list;
    }

    function _depositCollateral(uint256 vault_id, uint256 amount) internal {
        uint conv_vault_id = sub(vault_id, 1);
        uint new_collateral = add(VaultList[conv_vault_id].lck_collateral, amount);
        VaultList[conv_vault_id].lck_collateral = new_collateral;
        uint256 new_col_ratio = ((new_collateral * 1000000000000000000)  / VaultList[conv_vault_id].debt);
        VaultList[conv_vault_id].col_ratio = new_col_ratio;
    }

    function getVaultColRatio(uint256 vault_id) public view returns(uint) {
        return  (getVault(vault_id).lck_collateral * 1000000000000000000)  / getVault(vault_id).debt;
    }

    function depositCollateral(uint vault_id) external payable validateOwner(vault_id) validateVault(vault_id) validateLiquidation(vault_id) validateAmountReceived(msg.value)  returns (bool) {
        _depositCollateral(vault_id, msg.value);
        return true;
    }

    function generateStc(uint256 vault_id, uint256 collateral_amt) external payable validateOwner(vault_id) validateVault(vault_id) validateLiquidation(vault_id) validateAmountReceived(collateral_amt) returns(bool) {
        uint conv_vault_id = sub(vault_id, 1);
        uint256 equivalent_stc = getEquivalentSTC(collateral_amt);
        uint256 balance = sub(msg.value, collateral_amt);
        _depositCollateral(vault_id, collateral_amt);
        uint256 new_debt = add(VaultList[conv_vault_id].debt, equivalent_stc);
        VaultList[conv_vault_id].debt = new_debt;
        if (balance > 0) {
            VaultList[conv_vault_id].avail_collateral = add(VaultList[conv_vault_id].avail_collateral, balance);
        }
        _mintStc(equivalent_stc);
        return true;
    }

    function withdrawCollateral(uint256 vault_id, uint256 amount) external validateOwner(vault_id) validateVault(vault_id) validateLiquidation(vault_id) validateAvailableBalance(vault_id, amount) returns(bool) {
        uint conv_vault_id = sub(vault_id, 1);
        uint256 new_available_balance = sub(VaultList[conv_vault_id].avail_collateral, amount);
        VaultList[conv_vault_id].avail_collateral = new_available_balance;
        payable(msg.sender).transfer(amount);
        return true;
    }

    function debtDuration(uint256 vault_id) public view returns(uint) {
        uint start_date = getVault(vault_id).created_at;
        uint last_payment_date = getVault(vault_id).last_payment_at; 
        uint duration_period;
        if(getVault(vault_id).debt > 0) {
            if (start_date > 0 && last_payment_date == 0) {
            uint duration_seconds = sub(block.timestamp, start_date);
            duration_period = (duration_seconds / interestDuration);
            }
            if (start_date > 0 && last_payment_date > 0) {
            uint duration_seconds = sub(block.timestamp, last_payment_date);
            duration_period = (duration_seconds / interestDuration);
            }
        }else{
            if(start_date > 0) {
            uint duration_seconds = sub(last_payment_date, start_date);
            duration_period = (duration_seconds / interestDuration);
            }else{
            duration_period = 0;
            }
        }
        return duration_period;
    }

    function debtInterest(uint256 vault_id) public view returns(uint) {
        uint debt_duration = debtDuration(vault_id);
        uint debt = getVault(vault_id).debt;
        uint interest_amt;
        if(debt_duration > 0) {
            uint _interest = getVault(vault_id).interest;
            uint _interest_amt = (_interest * debt) / 1000000000000000000;
            interest_amt = debt_duration * _interest_amt; 
        }else{
            interest_amt = debt_duration;
        }
        return interest_amt;
    }

    function vaultTotalDebt(uint256 vault_id) external view returns(uint) {
        uint total_debt = add(getVault(vault_id).debt, debtInterest(vault_id));
        return  total_debt;
    }

    function _payDebt(uint256 vault_id, uint256 amount, uint256 old_debt, uint256 total_debt) internal {
        uint conv_vault_id = sub(vault_id, 1);
        uint new_debt = sub(total_debt,amount);
        uint debt_paid = sub(old_debt, new_debt);
        uint deposit_amt = sub(amount, debt_paid);
        ISTC istc = ISTC(stcAddress);
        if (deposit_amt > 0) {
            istc.transferFrom(msg.sender, address(this), deposit_amt);
        }
        istc.burn(msg.sender, debt_paid);
        if (new_debt == 0) {
            VaultList[conv_vault_id].avail_collateral = add(VaultList[conv_vault_id].avail_collateral, VaultList[conv_vault_id].lck_collateral);
            VaultList[conv_vault_id].lck_collateral = 0;
            VaultList[conv_vault_id].col_ratio = 0;
        }else{
            uint equivalent_collateral = getEquivalentCollateral(vault_id, debt_paid);
            VaultList[conv_vault_id].avail_collateral = add(VaultList[conv_vault_id].avail_collateral, equivalent_collateral);
            uint new_lck_col = sub(VaultList[conv_vault_id].lck_collateral, equivalent_collateral);
            VaultList[conv_vault_id].lck_collateral = new_lck_col;
            VaultList[conv_vault_id].col_ratio = (new_lck_col * 1000000000000000000) / new_debt;
        }
        VaultList[conv_vault_id].debt = new_debt;
        VaultList[conv_vault_id].last_payment_at = block.timestamp;
    }

    function payDebt(uint256 vault_id, uint256 amount) external validateOwner(vault_id) validateVault(vault_id) validateLiquidation(vault_id)  returns (bool) {
        require(amount > 0, "STB-ERR_3: Amount inputed is lesser than than zero(0)");
        uint debt = getVault(vault_id).debt;
        uint interest_amt = debtInterest(vault_id);
        uint total_debt = add(debt, interest_amt);
        require(total_debt > 0, "STB-ERR_10: this vault has no outstanding debt, verify and try again");
        require(total_debt >= amount, "STB-ERR_11: Debt overpayment, verify your outstanding debt and try again");
        if (interest_amt > 0) {
             require(amount >= interest_amt,  "STB-ERR_12: input amount is lesser than interest");
        }
        _payDebt(vault_id, amount, debt, total_debt);
        return true;
    }

    function authorize(address account) external validateIsAdmin() validateAddress(account){
        isAuthorized[account] = true;
    }

    function unauthorize(address account) external validateIsAdmin() validateNotAdmin(account) {
        delete isAuthorized[account];
    } 

    function updateMinimumColRatio(uint256 new_ratio) external validateAuthorization() validateMinimumColRatio(new_ratio) returns(bool) {
        minimumColRatio = new_ratio;
        return true;
    }

    function updateInterest(uint256 new_interest) external validateIsAdmin() returns(bool) {
        interest = new_interest;
        return true;
    }

    function updateInterestDuration(uint new_duration) external validateIsAdmin() returns(bool) {
        interestDuration = new_duration;
        return true;
    }

    function updateMaximumVault(uint8 new_max) external validateIsAdmin() validateNewMaxVault(new_max) returns(bool) {
        maximumVaultPerUser = new_max;
        return true;
    }

    function updateRegulatorPercentage(uint256 new_reg_perc) external validateIsAdmin() validateRegulatorPerc(new_reg_perc) returns(bool) {
        regulatorPercentage = new_reg_perc;
        return true;
    }

    function totalVaults() external view returns(uint) {
        return VaultList.length;
    }

    function totalLockedCol() external view returns(uint) {
        uint total = 0;
        for(uint i = 0; i < VaultList.length; i++) {
            if (VaultList[i].lck_collateral > 0) {
                total += VaultList[i].lck_collateral;
            }
        }
        return total;
    }

    function totalAvailableCol() external view returns(uint) {
        uint total = 0;
        for(uint i = 0; i < VaultList.length; i++) {
            if (VaultList[i].avail_collateral > 0) {
                total += VaultList[i].avail_collateral;
            }
        }
        return total;
    }

    function userTotalLockedCol(address account) external view returns(uint) {
        uint total = 0;
        for(uint i = 0; i < getUserVaults(account).length; i++) {
            if ( getUserVaults(account)[i].lck_collateral > 0) {
                total += getUserVaults(account)[i].lck_collateral;
            }
        }
        return total;
    }

    function userTotalAvailableCol(address account) external view returns(uint) {
        uint total = 0;
        for(uint i = 0; i < getUserVaults(account).length; i++) {
            if (getUserVaults(account)[i].avail_collateral > 0) {
                total += getUserVaults(account)[i].avail_collateral;
            }
        }
        return total;
    }

    function userTotalDebt(address account) external view returns(uint) {
        uint total = 0;
        for(uint i = 0; i < getUserVaults(account).length; i++) {
            if (getUserVaults(account)[i].debt > 0) {
                total += getUserVaults(account)[i].debt;
            }
        }
        return total;
    }


    function _closeVault(uint256 vault_id) internal {
        uint conv_vault_id = sub(vault_id, 1);
        address owner = VaultList[conv_vault_id].owner;
        uint prev_lck_collateral = VaultList[conv_vault_id].lck_collateral;
        VaultList[conv_vault_id].lck_collateral = 0;
        VaultList[conv_vault_id].col_ratio = 0;
        VaultList[conv_vault_id].closed_at = block.timestamp;
        emit VaultClosure(owner, vault_id, block.timestamp, msg.sender, getRegulatorFee(prev_lck_collateral));
    }

    function inspectVault(uint256 vault_id) external validateAuthorization() validateVault(vault_id) validateVaultInspection(vault_id) returns(bool) {
        uint conv_vault_id = sub(vault_id, 1);
        uint lck_col =  VaultList[conv_vault_id].lck_collateral;
        uint avail_col = VaultList[conv_vault_id].avail_collateral;
        if(avail_col > 0) {
            VaultList[conv_vault_id].avail_collateral = 0;
            uint new_collateral = add(lck_col, avail_col);
            VaultList[conv_vault_id].lck_collateral = new_collateral;
            uint256 new_col_ratio = (new_collateral * 1000000000000000000)  / VaultList[conv_vault_id].debt;
            VaultList[conv_vault_id].col_ratio = new_col_ratio;
            if(new_col_ratio >= minimumColRatio) {
               return true;
            }else{
                _closeVault(vault_id);
                return false;
            }
        }else{
            _closeVault(vault_id);
            return false;
        }
    }

    function allVaultsInLiquidation() external view returns(Vault [] memory) {
        Vault[] memory list = new Vault [](VaultList.length);
        for(uint i = 0; i < VaultList.length; i++) {
            if (VaultList[i].closed_at == 0 && VaultList[i].col_ratio < minimumColRatio) {
               list[i] = VaultList[i];
            }
        }
        return list;   

    }

    function allHauntedVaults() external view returns(Vault [] memory) {
        Vault[] memory list = new Vault [](VaultList.length);
        for(uint i = 0; i < VaultList.length; i++) {
            if (VaultList[i].closed_at > 0 && VaultList[i].debt > 0) {
               list[i] = VaultList[i];
            }
        }
        return list;   

    }
}