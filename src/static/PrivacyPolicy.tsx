import MarkdownPreview from '@uiw/react-markdown-preview'

const body = `# Loony Privacy Policy

**Effective Date: 12 October, 2014**

At **Loony**, we respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, store, and share your information when you use our platform. By accessing or using Loony, you agree to this Privacy Policy.

### 1. **Information We Collect**

We collect information to provide better services to all users of Loony. The types of data we collect are:

#### a. **Information You Provide**

- **Account Information**: When you sign up for Loony, we may collect personal details such as your name, email address, and username.
- **Content**: Any content you post (such as blogs, articles, or books), as well as comments, likes, or other interactions with the platform, are collected and stored.
- **Profile Information**: You may provide additional information to personalize your profile, such as your bio, profile picture, or social media links.

#### b. **Automatically Collected Information**

- **Usage Data**: We collect information about how you use Loony, such as the types of content you view or create, interactions with other users, and the time and duration of your activities.
- **Device Information**: We may collect details about the devices you use to access Loony, including hardware model, operating system, unique device identifiers, and network information.
- **Cookies and Tracking Technologies**: We use cookies and similar technologies to collect data on how you interact with Loony. This helps us improve user experience and personalize content.

#### c. **Third-Party Information**

We may collect information from third-party services if you choose to link those services to your Loony account, such as social media platforms for authentication or sharing content.

### 2. **How We Use Your Information**

Loony uses your data to provide and improve the platform's services. Specifically, we use your information for:

- **Providing Services**: To enable you to create, share, and interact with content, including personalization of your experience.
- **Account Management**: To create and manage your account, and communicate with you about your account or platform updates.
- **Improving Our Platform**: We analyze user behavior and platform usage to improve features, fix issues, and enhance user experience.
- **Safety and Security**: To monitor, detect, and prevent fraudulent, abusive, or illegal activities on Loony, and to protect the safety and integrity of the platform.
- **Communications**: To send you relevant updates, newsletters, and notifications related to the platform. You can opt out of non-essential communications at any time.
- **Advertising and Analytics**: We may use aggregated data for advertising and analytic purposes, ensuring that ads and recommendations are relevant to you.

### 3. **How We Share Your Information**

Loony does not sell your personal data. However, we may share your information with:

- **Service Providers**: Third-party vendors who help us provide and improve our services, such as hosting, data analysis, and security.
- **Legal Requirements**: We may disclose your information if required to do so by law, or if we believe such action is necessary to comply with legal processes, protect our rights, or enforce our terms.
- **Business Transfers**: If Loony is involved in a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction.
- **With Your Consent**: We may share your information with third parties when you explicitly consent to such sharing.

### 4. **Data Storage and Security**

We take data security seriously and implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no online platform can be 100% secure, so we cannot guarantee the absolute security of your data.

Your data is stored on servers located in [Specify Location(s)], and we retain your information as long as your account is active or as necessary to provide services and comply with legal obligations.

### 5. **Your Rights and Choices**

You have several rights regarding your data on Loony:

- **Access and Update**: You can access and update your personal information via your account settings.
- **Delete Your Account**: You may request to delete your account and personal data at any time. Upon deletion, we will remove your data from our active databases, though some information may be retained for legal or security reasons.
- **Opt-out of Communications**: You can opt out of receiving promotional emails or newsletters by following the unsubscribe instructions in those communications.
- **Cookies**: Most browsers allow you to control or block cookies. If you disable cookies, some features of Loony may not function properly.

### 6. **Children's Privacy**

Loony is not intended for children under the age of 13. We do not knowingly collect or solicit personal data from children under 13. If we become aware that we have collected personal data from a child under 13, we will delete that information as quickly as possible.

### 7. **Third-Party Links**

Loony may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review the privacy policies of those sites when you visit them.

### 8. **Changes to This Privacy Policy**

We may update this Privacy Policy from time to time. When we make changes, we will notify you by revising the “Effective Date” at the top of this policy and, if necessary, notify you via email or through the platform. Your continued use of Loony after changes are made indicates your acceptance of the revised policy.

### 9. **Contact Us**

If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:

- **Email**: sankar@sankarboro.com
- **Address**: Kalipahar, Amingaon, Guwahati, Kamrup, Assam, 781031

---

By using **Loony**, you agree to this Privacy Policy. Thank you for trusting us with your information and being part of our creative community!

---`

const PrivacyPolicy = () => {
  return (
    <div className="home-container">
      <div style={{ width: '60%', marginRight: 'auto', marginLeft: 'auto' }}>
        <MarkdownPreview
          source={body}
          wrapperElement={{ 'data-color-mode': 'light' }}
        />
      </div>
    </div>
  )
}

export default PrivacyPolicy
