//package com.first.tinder.controller;
//
//import io.portone.sdk.server.common.Currency;
//import io.portone.sdk.server.payment.PaidPayment;
//import io.portone.sdk.server.payment.PaymentClient;
//import io.portone.sdk.server.payment.VirtualAccountIssuedPayment;
//import io.portone.sdk.server.webhook.WebhookTransaction;
//import io.portone.sdk.server.webhook.WebhookVerifier;
//import kotlinx.serialization.json.Json;
//import kotlinx.serialization.Serializable;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestHeader;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//class PaymentController(secret: PortOneSecretProperties) {
//    data class Item(
//            val id: String,
//            val name: String,
//            val price: Int,
//            val currency: String,
//            )
//
//  data class ExamplePayment(
//            val status: String,
//            )
//
//    @Serializable
//    data class CustomData(val item: String)
//
//    class CompletePaymentRequest {
//        var paymentId: String = ""
//    }
//
//    companion object {
//        private val items: Map<String, Item> =
//        mapOf(
//                "shoes" to
//                Item(
//                        id = "shoes",
//                        name = "신발",
//                        price = 1000,
//                        currency = Currency.Krw.value,
//                        ),
//                )
//
//        private val paymentStore: MutableMap<String, ExamplePayment> = mutableMapOf()
//        private val json: Json = Json { ignoreUnknownKeys = true }
//        private val logger: Logger = LoggerFactory.getLogger(PaymentController::class.java)
//    }
//
//    private val portone = PaymentClient(apiSecret = secret.api)
//    private val portoneWebhook = WebhookVerifier(secret.webhook)
//
//    @GetMapping("/api/item")
//    fun getItem(): Item {
//        return items["shoes"]!!
//    }
//
//    @PostMapping("/api/payment/complete")
//    suspend fun completePayment(
//            @RequestBody completeRequest: CompletePaymentRequest,
//            ): Payment = syncPayment(completeRequest.paymentId)
//
//    suspend fun syncPayment(paymentId: String): ExamplePayment {
//        val payment =
//                paymentStore.getOrPut(paymentId) {
//            ExamplePayment("PENDING")
//        }
//        val actualPayment =
//        try {
//            portone.getPayment(paymentId = paymentId)
//        } catch (_: Exception) {
//            throw SyncPaymentException()
//        }
//        return if (actualPayment is PaidPayment) {
//            if (!verifyPayment(actualPayment)) throw SyncPaymentException()
//            logger.info("결제 성공 {}", actualPayment)
//            if (payment.status == "PAID") {
//                payment
//            } else {
//                payment.copy(status = "PAID").also {
//                    paymentStore[paymentId] = it
//                }
//            }
//        } else {
//            throw SyncPaymentException()
//        }
//    }
//
//    fun verifyPayment(payment: PaidPayment): Boolean =
//    payment.customData?.let { customData ->
//            items[json.decodeFromString<CustomData>(customData).item]?.let {
//        payment.orderName == it.name &&
//                payment.amount.total == it.price.toLong() &&
//                payment.currency.value == it.currency
//    }
//    } == true
//
//    @PostMapping("/api/payment/webhook")
//    suspend fun handleWebhook(
//            @RequestBody body: String,
//            @RequestHeader("webhook-id") webhookId: String,
//            @RequestHeader("webhook-timestamp") webhookTimestamp: String,
//            @RequestHeader("webhook-signature") webhookSignature: String,
//            ) {
//        val webhook =
//        try {
//            portoneWebhook.verify(body, webhookId, webhookTimestamp, webhookSignature)
//        } catch (_: Exception) {
//            throw SyncPaymentException()
//        }
//        if (webhook is WebhookTransaction) {
//            syncPayment(webhook.data.paymentId)
//        }
//    }
//}
