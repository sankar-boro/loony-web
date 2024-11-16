import MarkdownPreview from '@uiw/react-markdown-preview'

const body = `# Loony User Agreement

**Effective Date: 12 October, 2014**

Welcome to **Loony**! This User Agreement (the “Agreement”) governs your access to and use of the Loony platform, including all content, services, and features available on or through the platform. By accessing or using Loony, you agree to comply with and be bound by the terms of this Agreement.

Please read this Agreement carefully. If you do not agree with the terms, you must not use Loony.

---

### 1. **Acceptance of Terms**

By creating an account or accessing Loony, you agree to the terms and conditions outlined in this Agreement. This Agreement applies to all users of the platform, including content creators, readers, and visitors. 

If you are using Loony on behalf of an organization, you represent that you have the authority to bind that organization to this Agreement.

### 2. **Changes to This Agreement**

Loony reserves the right to update or modify this Agreement at any time. When we make changes, we will update the “Effective Date” and, where appropriate, notify you via email or through the platform. Your continued use of the platform after changes are made constitutes your acceptance of the revised Agreement. If you do not agree with the changes, you must stop using Loony.

### 3. **Account Registration and Security**

- **Registration**: To use certain features of Loony, you may need to register for an account. You must provide accurate and up-to-date information during registration and maintain the security of your account.
- **Account Responsibility**: You are responsible for all activities that occur under your account, including any content you post. You must notify us immediately if you suspect any unauthorized use of your account.
- **Age Requirement**: You must be at least 13 years of age to create an account on Loony. If you are under 18, you must have parental or legal guardian consent to use the platform.

### 4. **User Content**

You retain ownership of any original content (blogs, articles, books, etc.) you post to Loony. By posting content, you grant Loony a non-exclusive, worldwide, royalty-free, perpetual license to host, display, reproduce, modify, distribute, and promote your content on the platform.

#### a. **Content Standards**
You agree that your content will comply with the following standards:
- It must not violate our [Content Policy](link to content policy).
- It must not infringe on any third-party intellectual property rights.
- It must not contain harmful, deceptive, or illegal content.

#### b. **Content Moderation**
Loony reserves the right to remove, edit, or restrict access to any content that violates this Agreement or our Content Policy, or that we otherwise deem inappropriate or harmful to the community. 

#### c. **Your Responsibility for Content**
You are solely responsible for the content you post on Loony and any consequences arising from sharing your content. Loony is not responsible for any claims, damages, or losses arising from user-generated content.

### 5. **Intellectual Property Rights**

#### a. **Loony's Content and Services**
All rights, title, and interest in and to Loony, including its design, features, and services, are owned by Loony and its licensors. You may not copy, modify, distribute, or reverse engineer any part of Loony without prior written consent.

#### b. **Third-Party Rights**
You must not post content that infringes on the intellectual property rights of others. If you believe that content on Loony infringes on your rights, please notify us at [Your Contact Email].

### 6. **Prohibited Uses**

You agree not to use Loony for the following:

- **Illegal Activities**: You may not use Loony to engage in unlawful activities or promote illegal actions.
- **Harmful or Offensive Content**: You may not post content that is harmful, abusive, defamatory, or violates our Content Policy.
- **Security Violations**: You must not interfere with the security, availability, or performance of Loony. This includes attempts to bypass security measures, distribute malware, or engage in denial-of-service attacks.
- **Spamming**: You may not use Loony to send unsolicited or spam communications.
- **Commercial Exploitation**: You may not use Loony to sell, promote, or advertise products or services without Loony's explicit permission.

### 7. **Termination and Suspension**

Loony reserves the right to suspend or terminate your account at any time for violating this Agreement or any applicable laws. In cases of account suspension or termination, you may lose access to content, data, or features associated with your account.

You may terminate your account at any time by contacting us at [Your Contact Email]. Upon termination, you will lose access to the platform and all content associated with your account, though Loony may retain certain data as required by law.

### 8. **Privacy**

Your privacy is important to us. By using Loony, you agree to our [Privacy Policy](link to privacy policy), which explains how we collect, use, and protect your information.

### 9. **Disclaimers and Limitation of Liability**

#### a. **Platform Provided "As-Is"**
Loony is provided on an "as-is" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.

#### b. **No Guarantee of Availability**
We do not guarantee that Loony will be available at all times or that it will be free from disruptions, delays, or errors. We are not responsible for any issues you may experience as a result of using Loony.

#### c. **Limitation of Liability**
To the maximum extent permitted by law, Loony and its affiliates, officers, employees, or partners will not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the platform. Our total liability for any claims arising from your use of Loony is limited to the amount you paid (if any) for accessing Loony's services in the past 12 months.

### 10. **Indemnification**

You agree to indemnify, defend, and hold harmless Loony and its affiliates, officers, employees, and partners from any claims, liabilities, damages, losses, or expenses (including legal fees) arising out of your use of the platform, your violation of this Agreement, or your infringement of any third-party rights.

### 11. **Governing Law and Dispute Resolution**

#### a. **Governing Law**
This Agreement and your use of Loony are governed by the laws of [Your Country or State], without regard to its conflict of laws principles.

#### b. **Dispute Resolution**
Any disputes arising from this Agreement or your use of Loony will be resolved through binding arbitration in [Your Location], unless otherwise required by applicable law. You waive any right to a jury trial or class action litigation.

### 12. **Miscellaneous**

- **Entire Agreement**: This Agreement, along with our Privacy Policy and Content Policy, constitutes the entire agreement between you and Loony regarding your use of the platform.
- **Severability**: If any provision of this Agreement is found to be unenforceable, the remaining provisions will remain in full force and effect.
- **Waiver**: Failure to enforce any provision of this Agreement will not be considered a waiver of our rights.
- **Assignment**: You may not assign or transfer your rights under this Agreement without our consent. Loony may assign or transfer this Agreement in connection with a merger, sale, or reorganization.

### 13. **Contact Us**

If you have any questions about this Agreement, please contact us at:

- **Email**: sankar@sankarboro.com
- **Address**: Kalipahar, Amingaon, Guwahati, Kamrup, Assam, 781031

---

By using **Loony**, you acknowledge that you have read, understood, and agree to be bound by this User Agreement.

---`

const UserAgreement = () => {
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

export default UserAgreement
