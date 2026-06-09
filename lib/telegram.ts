/**
 * Telegram Notification Service
 * Sends booking notifications to Telegram chat
 */

const TELEGRAM_BOT_TOKEN = "5082249746:AAFwgAFoYjeF_B7kRouQThQm8ckGXVGp1h4"
const TELEGRAM_CHAT_ID = "5167402315"

interface BookingData {
  id?: string
  customerName: string
  customerPhone: string
  customerEmail: string
  productType: string
  rentalStartDate: string
  rentalEndDate: string
  quantity?: number
  totalPrice?: number
  address?: string
  notes?: string
}

/**
 * Send booking notification to Telegram
 * @param booking - Booking data to send
 * @returns Promise with send result
 */
export async function sendBookingToTelegram(booking: BookingData): Promise<boolean> {
  try {
    // Format the booking message
    const message = formatBookingMessage(booking)

    // Send to Telegram
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      console.error("[v0] Telegram API error:", response.statusText)
      return false
    }

    const data = await response.json()

    if (data.ok) {
      console.log("[v0] Booking sent to Telegram successfully")
      return true
    } else {
      console.error("[v0] Telegram error:", data.description)
      return false
    }
  } catch (error) {
    console.error("[v0] Failed to send booking to Telegram:", error)
    return false
  }
}

/**
 * Format booking data into readable Telegram message
 * @param booking - Booking data to format
 * @returns Formatted HTML message for Telegram
 */
function formatBookingMessage(booking: BookingData): string {
  const lines = [
    "🎉 <b>New Booking Received!</b>",
    "",
    "<b>Customer Information:</b>",
    `📝 Name: ${booking.customerName}`,
    `📞 Phone: ${booking.customerPhone}`,
    `📧 Email: ${booking.customerEmail}`,
    "",
    "<b>Booking Details:</b>",
    `🛠️ Product: ${booking.productType}`,
    `📅 Start Date: ${formatDate(booking.rentalStartDate)}`,
    `📅 End Date: ${formatDate(booking.rentalEndDate)}`,
  ]

  if (booking.quantity) {
    lines.push(`📦 Quantity: ${booking.quantity}`)
  }

  if (booking.totalPrice) {
    lines.push(`💰 Total Price: ₹${booking.totalPrice}`)
  }

  if (booking.address) {
    lines.push(`📍 Address: ${booking.address}`)
  }

  if (booking.notes) {
    lines.push(`📌 Notes: ${booking.notes}`)
  }

  lines.push("")
  lines.push(`<i>Booking ID: ${booking.id || "Pending"}</i>`)
  lines.push(`<i>Time: ${new Date().toLocaleString("en-IN")}</i>`)

  return lines.join("\n")
}

/**
 * Format date string to readable format
 * @param dateString - Date string to format
 * @returns Formatted date
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

/**
 * Send test message to verify Telegram connection
 * @returns Promise with test result
 */
export async function sendTestMessage(): Promise<boolean> {
  const testMessage = "✅ Test message from ACRentService booking system"

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: testMessage,
        parse_mode: "HTML",
      }),
    })

    return response.ok
  } catch {
    return false
  }
}
