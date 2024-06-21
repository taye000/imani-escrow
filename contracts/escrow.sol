// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EscrowContract {
    // Enum definitions for Payment and Delivery statuses
    enum PaymentStatus {
        Pending,
        Paid,
        Released,
        Returned
    }
    enum DeliveryStatus {
        Pending,
        Delivered,
        Confirmed
    }

    // Struct to define an Escrow Transaction
    struct EscrowTransaction {
        string productId; // Product ID
        uint256 price; // Price of the product
        string paymentMethod; // Payment method used
        string orderId; // Order ID
        string description; // Description of the product
        string currency; // Currency of the transaction
        string category; // Category of the product
        string sellerId; // Seller's ID (from traditional DB)
        string buyerId; // Buyer's ID (from traditional DB)
        PaymentStatus paymentStatus; // Payment status of the transaction
        DeliveryStatus buyerDeliveryStatus; // Delivery status from buyer's perspective
        DeliveryStatus sellerDeliveryStatus; // Delivery status from seller's perspective
    }

    // Mapping to store Escrow Transactions
    mapping(uint256 => EscrowTransaction) public transactions;

    // Counter for transaction IDs
    uint256 public transactionCount;

    // Address of the platform's wallet
    address public platformWallet;

    // Events for various actions
    event ItemAdded(string productId, string orderId, string indexed sellerId);
    event BuyerPaymentInitiated(
        uint256 indexed transactionId,
        string indexed buyerId
    );
    event BuyerPaymentReceived(
        uint256 indexed transactionId,
        string indexed buyerId
    );
    event SellerDeliveryInitiated(
        uint256 indexed transactionId,
        string indexed sellerId
    );
    event BuyerDeliveryConfirmed(
        uint256 indexed transactionId,
        string indexed buyerId
    );
    event InspectionPassed(
        uint256 indexed transactionId,
        string indexed buyerId
    );
    event InspectionFailed(
        uint256 indexed transactionId,
        string indexed buyerId
    );
    event SellerPaymentReleaseInitiated(
        uint256 indexed transactionId,
        string indexed sellerId
    );
    event SellerPaymentReceived(
        uint256 indexed transactionId,
        string indexed sellerId
    );
    event PaymentReleased(
        uint256 indexed transactionId,
        string indexed buyerId,
        string indexed sellerId
    );

    // Modifier to restrict access to platform's wallet
    modifier onlyPlatform() {
        require(
            msg.sender == platformWallet,
            "Only platform wallet can call this function"
        );
        _;
    }

    // Constructor to initialize the contract with the deployer's address as platform's wallet
    constructor() {
        platformWallet = msg.sender;
    }

    // Function to allow changing the platform's wallet address, restricted to the current platform wallet
    function setPlatformWallet(address _platformWallet) external {
        require(
            msg.sender == platformWallet,
            "Only platform wallet can set new platform wallet"
        );
        platformWallet = _platformWallet;
    }

    // Function to add a new item/transaction to the escrow service
    function addItem(
        string memory _productId,
        uint256 _price,
        string memory _paymentMethod,
        string memory _orderId,
        string memory _description,
        string memory _currency,
        string memory _category,
        string memory _sellerId,
        string memory _buyerId
    ) external onlyPlatform {
        transactions[transactionCount] = EscrowTransaction(
            _productId,
            _price,
            _paymentMethod,
            _orderId,
            _description,
            _currency,
            _category,
            _sellerId,
            _buyerId,
            PaymentStatus.Pending,
            DeliveryStatus.Pending,
            DeliveryStatus.Pending
        );

        emit ItemAdded(_productId, _orderId, _sellerId);
        transactionCount++;
    }

    // Function for the buyer to initiate payment for a transaction
    function initiatePayment(uint256 _transactionId) external onlyPlatform {
        require(
            transactions[_transactionId].paymentStatus == PaymentStatus.Pending,
            "Payment already initiated or processed"
        );

        transactions[_transactionId].paymentStatus = PaymentStatus.Paid;
        emit BuyerPaymentInitiated(
            _transactionId,
            transactions[_transactionId].buyerId
        );
    }

    // Function for the platform to confirm receiving payment from the buyer
    function receivePayment(uint256 _transactionId) external onlyPlatform {
        require(
            transactions[_transactionId].paymentStatus == PaymentStatus.Paid,
            "Payment not initiated or already received"
        );

        transactions[_transactionId].paymentStatus = PaymentStatus.Released;
        emit BuyerPaymentReceived(
            _transactionId,
            transactions[_transactionId].buyerId
        );
    }

    // Function for the seller to initiate delivery of the product
    function initiateSellerDelivery(
        uint256 _transactionId
    ) external onlyPlatform {
        require(
            transactions[_transactionId].buyerDeliveryStatus ==
                DeliveryStatus.Pending,
            "Delivery already initiated or confirmed"
        );

        transactions[_transactionId].buyerDeliveryStatus = DeliveryStatus
            .Delivered;
        emit SellerDeliveryInitiated(
            _transactionId,
            transactions[_transactionId].sellerId
        );
    }

    // Function for the buyer to confirm receiving the delivered product
    function confirmBuyerDelivery(
        uint256 _transactionId
    ) external onlyPlatform {
        require(
            transactions[_transactionId].buyerDeliveryStatus ==
                DeliveryStatus.Delivered,
            "Delivery not initiated or already confirmed"
        );

        transactions[_transactionId].buyerDeliveryStatus = DeliveryStatus
            .Confirmed;
        emit BuyerDeliveryConfirmed(
            _transactionId,
            transactions[_transactionId].buyerId
        );
    }

    // Function for the buyer to confirm inspection results (pass or fail)
    function confirmInspection(
        uint256 _transactionId,
        bool _inspectionPassed
    ) external onlyPlatform {
        require(
            transactions[_transactionId].buyerDeliveryStatus ==
                DeliveryStatus.Confirmed,
            "Delivery not confirmed"
        );

        if (_inspectionPassed) {
            emit InspectionPassed(
                _transactionId,
                transactions[_transactionId].buyerId
            );
        } else {
            emit InspectionFailed(
                _transactionId,
                transactions[_transactionId].buyerId
            );
        }
    }

    // Function for the seller to initiate release of payment after successful transaction
    function releaseSellerPayment(
        uint256 _transactionId
    ) external onlyPlatform {
        require(
            transactions[_transactionId].paymentStatus ==
                PaymentStatus.Released,
            "Payment not ready to be released"
        );

        transactions[_transactionId].paymentStatus = PaymentStatus.Returned; // Money returned to buyer if not already released
        emit SellerPaymentReleaseInitiated(
            _transactionId,
            transactions[_transactionId].sellerId
        );
    }

    // Function for the seller to confirm receiving payment after successful transaction
    function receiveSellerPayment(
        uint256 _transactionId
    ) external onlyPlatform {
        require(
            transactions[_transactionId].paymentStatus ==
                PaymentStatus.Released,
            "Payment not released"
        );

        transactions[_transactionId].paymentStatus = PaymentStatus.Returned; // Money returned to buyer after released to seller
        emit SellerPaymentReceived(
            _transactionId,
            transactions[_transactionId].sellerId
        );
    }

    // Function for the platform to release payment to seller after successful transaction
    function releasePayment(uint256 _transactionId) external onlyPlatform {
        require(
            transactions[_transactionId].paymentStatus ==
                PaymentStatus.Released,
            "Payment not ready to be released"
        );

        transactions[_transactionId].paymentStatus = PaymentStatus.Returned; // Money returned to buyer if not already released
        emit PaymentReleased(
            _transactionId,
            transactions[_transactionId].buyerId,
            transactions[_transactionId].sellerId
        );
    }

    // Example view function to check if payment is initiated
    function isPaymentInitiated(
        uint256 _transactionId
    ) external view returns (bool) {
        return
            transactions[_transactionId].paymentStatus != PaymentStatus.Pending;
    }

    // Function to calculate fee (pure function)
    function calculateFee(uint256 _amount) external pure returns (uint256) {
        // Simplified fee calculation logic
        return (_amount * 2) / 100; // 2% fee
    }

    // Example view function to get transaction details
    function getTransaction(
        uint256 _transactionId
    )
        external
        view
        returns (
            string memory productId,
            uint256 price,
            string memory paymentMethod,
            string memory orderId,
            string memory description,
            string memory currency,
            string memory category,
            string memory sellerId,
            string memory buyerId,
            PaymentStatus paymentStatus,
            DeliveryStatus buyerDeliveryStatus,
            DeliveryStatus sellerDeliveryStatus
        )
    {
        EscrowTransaction storage transaction = transactions[_transactionId];
        return (
            transaction.productId,
            transaction.price,
            transaction.paymentMethod,
            transaction.orderId,
            transaction.description,
            transaction.currency,
            transaction.category,
            transaction.sellerId,
            transaction.buyerId,
            transaction.paymentStatus,
            transaction.buyerDeliveryStatus,
            transaction.sellerDeliveryStatus
        );
    }
}
