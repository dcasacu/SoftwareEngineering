---
name: notification
description: Design and implement user notification systems for web and mobile apps. Use when asked to "add notifications", "push notifications", "toast alerts", "in-app messaging", or "notify users".
---

# User Notification System

Guidelines for designing effective notification systems that inform users without overwhelming them.

## Notification Types

| Type | Use Case | Disruption Level |
|------|----------|-----------------|
| **Toast/Banner** | Immediate feedback, confirmations | Low |
| **In-App Alert** | Important updates while using app | Medium |
| **Push Notification** | Time-sensitive, outside app | High |
| **Email** | Non-urgent, persistent records | Low |

## Toast Notifications

For quick, non-blocking feedback:

```javascript
// Good: Short, actionable, auto-dismiss
showToast({
  message: "Queue joined successfully!",
  type: "success", // success | warning | error | info
  duration: 3000,
  action: { label: "View", onClick: () => {} }
});

// Bad: Too long, blocks interaction
showToast({
  message: "You have successfully joined the queue for Martí's Fruits. Your position is #4.",
  duration: 10000
});
```

## Push Notification Best Practices

| Element | Guideline |
|---------|-----------|
| **Title** | Under 50 characters, specific |
| **Body** | Under 100 characters, clear action |
| **Icon** | Consistent app icon |
| **Click Action** | Deep link to relevant screen |

```javascript
// Queue turn notification
{
  title: "🛒 It's Your Turn!",
  body: "Martí's Fruits is ready for you",
  icon: "/icons/lineup-192.png",
  click_action: "/shop/shop1?action=checkin",
  badge: 1
}
```

## Do Not Disturb (DND) Respect

```javascript
// Check before sending non-critical push
async function shouldSendPush(notification) {
  if (notification.priority === 'high') return true;
  const dndStatus = await getDNDStatus();
  return !dndStatus.isActive;
}
```

## Queue Notifications for LineUp

For a queue management app like LineUp:

| Event | Notification | Timing |
|-------|--------------|--------|
| **Queue Joined** | "You're #X in line" | Immediate |
| **Almost Your Turn** | "Next up! Get ready" | When #2 |
| **Your Turn** | "It's your turn! 🛒" | Immediate + Vibration |
| **Queue Ended** | "Shop closed queue" | If applicable |

## Implementation Checklist

- [ ] Toast messages < 100 characters
- [ ] Action buttons for reversible operations
- [ ] Respect system DND settings
- [ ] Push permissions requested contextually
- [ ] Unsubscribe option readily available
- [ ] Test on iOS and Android