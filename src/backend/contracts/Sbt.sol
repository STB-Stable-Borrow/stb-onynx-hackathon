// SPDX-License-Identifier: MIT

pragma solidity >=0.5.11 < 0.9.0;

interface ISBT {

    //------READ FUNCTIONS-----//
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function isTokenHolder(address account) external view returns(bool) ;
    function tokenOwned(address account) external view returns(uint256);
    function isApproved(uint256 tokenId, address account) external view returns(bool);
    function tokenURI(uint256 tokenId) external view returns(string memory);
    function getRecordURI(uint256 tokenId, address contractAddress) external view returns(string memory);
    function totalTokenCount() external view returns(uint256);
    function contractOwner() external view returns(address);
    function claimContract() external view returns(address);
    function AllVerifiedContracts() external view returns(address [] memory);
    function isVerified(address account) external view returns(bool);


    //-------WRITE FUNCTIONS-----//
    function mint(string memory tokenUri) external;
    function approve(address account) external;
    function revoke(address account) external;
    function revokeAll() external;
    function addRecordURI(address account, uint256 tokenId, string memory tokenUri) external;
    function updateClaimContract(address account) external;
    function welcomeContract(address account) external;
    function blacklistContract(address account) external;
    function reclaimToken(uint256 tokenId, address prevOwner, address reclaimer) external;
}

contract SBT  {

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Last token id Minted
    uint256 private _lastTokenId;

    // Mapping from address to tokenid owned
    mapping(address => uint256) private _owners;

    // Mapping token to various approved accounts
    mapping(uint256 => mapping(address => bool)) private _tokenApprovals;

    // Mapping token to various records from verified contracts
    mapping(uint256 => mapping(address => string)) private _tokenRecords;

    // contract owner
    address private _contractOwner;

    // contract address of claimcontract(to reclaim token)
    address private _claimContract;

    // lists of verified contracts that can save record for tokens
    address[] private _verifiedContracts;

//------EVENTS---------

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    event Welcoming(address indexed from, address indexed to, uint indexed time);

    event Blacklisting(address indexed from, address indexed to, uint indexed time);


    constructor(string memory name_, string memory symbol_)  {
        _name = name_;
        _symbol = symbol_;
        _contractOwner = msg.sender;
    }

//------MODIFIERS---------
    modifier validateAddress(address account) {
        require(account != address(0), "SBT_ERR1: Invalid address(zero) passed");
        _;
    }

    modifier validateDifferentAddress(address from, address to) {
        require(from != to, "SBT_ERR3: Same accounts detected");
        _;
    }

    modifier validateTokenOwner(address account, uint256 tokenId) {
        require(_owners[account] == tokenId, "SBT_ERR4: account passed is not corresponding token owner");
        _;
    }

    modifier validateContractOwner(address account) {
        require(account == _contractOwner, "SBT_ERR5: Caller is not contract owner");
        _;
    }

    modifier validateApproval(uint256 tokenId, address account) {
        require(_tokenApprovals[tokenId][account] == true, "SBT_ERR6: caller or account passed is not approve");
        _;
    }

    modifier validateClaimContract(address account) {
        require(account == _claimContract, "SBT_ERR7: caller is not claim contract");
        _;
    }

    modifier validateIsContract(address account) {
        require(account.code.length > 0, "SBT_ERR8: caller or account passed is not a valid contract account");
        _;
    }

    modifier validateTokenHolder(address account) {
        require(_owners[account] > uint256(0), "SBT_ERR9: account is not a token holder");
        _;
    }

    modifier validateNotTokenHolder(address account) {
        require(_owners[account] == uint256(0), "SBT_ERR10: account is alredy a token holder");
        _;
    }


//-----READ FUNCTIONS-------

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function isTokenHolder(address account) external view returns(bool) {
        return  _owners[account] > uint256(0);
    }

    function tokenOwned(address account) external view returns(uint256) {
        return _owners[account];
    }

    function isApproved(uint256 tokenId, address account) external view returns(bool) {
        return _tokenApprovals[tokenId][account];
    }

    function tokenURI(uint256 tokenId) external view returns(string memory) {
        return _tokenRecords[tokenId][address(this)];
    }

    function getRecordURI(uint256 tokenId, address contractAddress) external view returns(string memory) {
        return _tokenRecords[tokenId][contractAddress];
    }

    function totalTokenCount() external view returns(uint256) {
        return _lastTokenId;
    }

    function contractOwner() external view returns(address) {
        return _contractOwner;
    }

    function claimContract() external view returns(address) {
        return _claimContract;
    }

    function AllVerifiedContracts() external view returns(address [] memory) {
        return _verifiedContracts;
    }

    function isVerified(address account) public view returns(bool) {
        bool _isVerified = false;
        for(uint i = 0; i < _verifiedContracts.length; i++) {
            if(_verifiedContracts[0] == account) {
                _isVerified = true;
            }
        }
        return _isVerified;
    }


//-------WRITE FUNCTIONS-----

    function mint(string memory tokenUri) external validateAddress(msg.sender) validateNotTokenHolder(msg.sender)  {
       uint256 newTokenId = _lastTokenId + 1;
        _owners[msg.sender] = newTokenId;
        _tokenRecords[newTokenId][address(this)] = tokenUri;
        _lastTokenId = newTokenId;
        emit Transfer(address(0), msg.sender, newTokenId);
    }


    function approve(address account) external validateTokenHolder(msg.sender) validateDifferentAddress(msg.sender, account) validateIsContract(account) {
        bool _isVerified = isVerified(account);
        if(_isVerified) {
        uint tokenId = _owners[msg.sender];
        require(_tokenApprovals[tokenId][account] == false, "SBT_ERR11: account passed is already approved");
        _tokenApprovals[tokenId][account] = true;
        emit Approval(msg.sender, account, tokenId);
        }else{
            revert("SBT_ERR12: account is not a verified contract");
        }
    }

    function revoke(address account) external validateTokenHolder(msg.sender) validateDifferentAddress(msg.sender, account) {
        uint tokenId = _owners[msg.sender];
        require(_tokenApprovals[tokenId][account] == true, "SBT_ERR6: caller or account passed is not approve");
        _tokenApprovals[tokenId][account] = false;
    }

    function revokeAll() external validateTokenHolder(msg.sender) {
        uint tokenId = _owners[msg.sender];
        for(uint i = 0; i < _verifiedContracts.length; i++) {
             _tokenApprovals[tokenId][ _verifiedContracts[i]] = false;
        }
    }
    

    function addRecordURI(address account, uint256 tokenId, string memory tokenUri) external validateIsContract(msg.sender) validateApproval(tokenId, msg.sender) validateTokenOwner(account, tokenId) {
        _tokenRecords[tokenId][msg.sender] = tokenUri;
    }

    function updateClaimContract(address account) external validateContractOwner(msg.sender) validateAddress(account) validateIsContract(account) {
        _claimContract = account;
    }

    function welcomeContract(address account) external validateContractOwner(msg.sender) validateAddress(account) validateIsContract(account) {
        _verifiedContracts.push(account);
        emit Welcoming(address(this), account, block.timestamp);
    }

    function _getIndex(address [] memory array, address account) internal pure returns(uint) {
        uint256 index;
        for(uint i = 0; i < array.length; i++) {
           if(array[i] == account) {
               index = i;
           }
        }
        if(index == 0) {
            revert("SBT_ERR12: can't blacklist an unverified account");
        }else{
            return index;
        }
    }

    function blacklistContract(address account) external validateContractOwner(msg.sender) validateAddress(account) validateIsContract(account) {
        uint index = _getIndex(_verifiedContracts, account);
        for (uint i = index; i < _verifiedContracts.length - 1; i++) {
            _verifiedContracts[i] = _verifiedContracts[i + 1];
        }
        _verifiedContracts.pop();
        emit Blacklisting(address(this), account, block.timestamp);
    }
    
    function reclaimToken(uint256 tokenId, address prevOwner, address reclaimer) external validateClaimContract(msg.sender) validateTokenOwner(prevOwner, tokenId) validateAddress(reclaimer) validateNotTokenHolder(reclaimer) {
        delete(_owners[prevOwner]);
        for(uint i = 0; i < _verifiedContracts.length; i++) {
             _tokenApprovals[tokenId][_verifiedContracts[i]] = false;
        }
        _owners[reclaimer] = tokenId;
        emit Transfer(prevOwner, reclaimer, tokenId);
    }
}