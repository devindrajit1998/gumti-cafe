import { Order, CartItem, DeliveryAddress, OrderType } from './types';

export const DEFAULT_ADMIN_WHATSAPP = '919876543210';

/**
 * Format order details into a clean, professional WhatsApp message for the Restaurant.
 */
export function formatOrderForWhatsApp(
  order: {
    id: string;
    orderNumber?: string;
    restaurantName: string;
    restaurantAddress?: string;
    items: CartItem[];
    itemTotal: number;
    taxes: number;
    deliveryFee: number;
    platformFee?: number;
    discount: number;
    tip: number;
    grandTotal: number;
    orderType?: OrderType;
    tableNumber?: string;
    deliveryAddress?: DeliveryAddress;
    customerName?: string;
    customerPhone?: string;
    deliveryInstructions?: string[];
    cutleryNeeded?: boolean;
    appliedCouponCode?: string;
    createdAt?: string;
    scheduledDelivery?: string;
    isGroupOrder?: boolean;
    groupCode?: string;
    specialNotes?: string;
  }
): string {
  const dateStr = order.createdAt && order.createdAt !== 'Just now'
    ? order.createdAt
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

  const orderNum = order.orderNumber || order.id;
  const orderType = order.orderType || 'delivery';

  // Format Order Type Headline
  let orderTypeHeader = '🛵 *HOME DELIVERY ORDER*';
  if (orderType === 'dine_in') {
    orderTypeHeader = `🍽️ *DINE-IN ORDER* — *TABLE #${order.tableNumber || '1'}*`;
  } else if (orderType === 'pickup') {
    orderTypeHeader = '🛍️ *TAKEAWAY / SELF-PICKUP ORDER*';
  }

  // Format Items List
  const itemsText = order.items
    .map((item, index) => {
      let customText = '';
      if (item.customizations && item.customizations.length > 0) {
        const customDetails = item.customizations
          .map((c) => `${c.groupTitle}: ${c.selectedOptions.map((o) => o.name).join(', ')}`)
          .join(' | ');
        customText = `\n   ↳ _${customDetails}_`;
      }

      let notesText = '';
      if (item.specialInstructions) {
        notesText = `\n   ↳ 📝 _Note: ${item.specialInstructions}_`;
      }

      let userTag = '';
      if (order.isGroupOrder && item.orderedBy) {
        userTag = `\n   ↳ 👤 _Ordered for: ${item.orderedBy}_`;
      }

      const vegIcon = item.vegType === 'veg' ? '🟢' : item.vegType === 'egg' ? '🟡' : item.vegType === 'vegan' ? '🌱' : '🔴';
      return `${index + 1}. ${vegIcon} *${item.name}* x ${item.quantity} = ₹${item.price * item.quantity}${customText}${notesText}${userTag}`;
    })
    .join('\n');

  // Format Instructions
  const instructionsList = [
    ...(order.deliveryInstructions || []),
    order.specialNotes ? `Chef Note: ${order.specialNotes}` : '',
    order.cutleryNeeded === false ? 'No plastic cutlery needed 🌿' : '',
  ].filter(Boolean);

  const instructionsText = instructionsList.length > 0
    ? `\n*📝 SPECIAL INSTRUCTIONS:*\n${instructionsList.map((inst) => `• ${inst}`).join('\n')}\n`
    : '';

  // Scheduled delivery banner
  const scheduleText = order.scheduledDelivery && order.scheduledDelivery !== 'now'
    ? `*⏰ PREFERRED TIMING:* ${order.scheduledDelivery}\n`
    : '';

  // Group order banner
  const groupText = order.isGroupOrder
    ? `*👥 GROUP ORDER CODE:* #${order.groupCode || 'GROUP-ORDER'}\n`
    : '';

  // Discount text
  const discountText = order.discount > 0
    ? `\n• Coupon Discount${order.appliedCouponCode ? ` (${order.appliedCouponCode})` : ''}: -₹${order.discount}`
    : '';

  // Tip text
  const tipText = order.tip > 0 ? `\n• Delivery Tip: ₹${order.tip}` : '';

  // Customer Location / Destination Details
  let destinationText = '';
  if (orderType === 'dine_in') {
    destinationText = `• *Order Type:* 🍽️ Dine-in Table Order\n• *Table Number:* 🪑 *Table #${order.tableNumber || '1'}*`;
  } else if (orderType === 'pickup') {
    destinationText = `• *Order Type:* 🛍️ Takeaway / Pickup at Restaurant Counter\n• *Pickup Location:* ${order.restaurantAddress || order.restaurantName}`;
  } else if (order.deliveryAddress) {
    destinationText = `• *Order Type:* 🛵 Home Delivery\n• *Deliver To:* ${order.deliveryAddress.street}, ${order.deliveryAddress.area}, ${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}\n• *Address Type:* ${order.deliveryAddress.type} (${order.deliveryAddress.label || 'Default'})`;
  }

  const message = 
`*${orderTypeHeader}*
━━━━━━━━━━━━━━━━━━━━
*Order ID:* #${orderNum}
*Date & Time:* ${dateStr}
${groupText}${scheduleText}
*📍 RESTAURANT:*
• *${order.restaurantName}*
${order.restaurantAddress ? `• ${order.restaurantAddress}\n` : ''}
*👤 CUSTOMER DETAILS (NO LOGIN):*
• *Name:* ${order.customerName || 'Guest Customer'}
• *Phone:* ${order.customerPhone || (order.deliveryAddress ? order.deliveryAddress.phone : 'Not provided')}
${destinationText}

*🍽️ ORDERED ITEMS (${order.items.length}):*
${itemsText}
${instructionsText}
━━━━━━━━━━━━━━━━━━━━
*💰 BILL SUMMARY:*
• Items Subtotal: ₹${order.itemTotal}
• GST Taxes (5%): ₹${order.taxes}
${orderType === 'delivery' ? `• Packaging & Delivery: ₹${order.deliveryFee}` : '• Packaging: ₹0 (Free for Dine-In/Takeaway)'}${discountText}${tipText}
• *GRAND TOTAL:* *₹${order.grandTotal}*

*💳 PAYMENT:*
• *Direct to Restaurant on Delivery/Table (Cash / UPI)*
• _No upfront online payment required_
━━━━━━━━━━━━━━━━━━━━
_Please confirm my order and share preparation time!_ 🙏`;

  return message;
}

/**
 * Generate a WhatsApp click-to-chat URL
 */
export function generateWhatsAppUrl(message: string, adminPhone: string = DEFAULT_ADMIN_WHATSAPP): string {
  // Strip non-digits
  const cleanPhone = adminPhone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}
