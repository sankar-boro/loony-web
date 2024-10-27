import MarkdownPreview from '@uiw/react-markdown-preview'

const body = `# Loony Content Policy

**Effective Date: 12 October, 2014**

Welcome to **Loony**, a platform where creativity and knowledge thrive. Loony allows users to write and share blogs, articles, and books with the world. In order to ensure a safe, respectful, and productive community, we have established the following content policy. By using Loony, you agree to abide by these guidelines.

### 1. **Respectful Content**

Loony is committed to fostering a positive and inclusive environment. Content that harasses, threatens, or promotes violence or hatred against individuals or groups based on attributes like race, ethnicity, nationality, gender identity, sexual orientation, religion, or disability will not be tolerated.

- **No Hate Speech**: Discriminatory content, slurs, or derogatory comments directed at any person or group are strictly prohibited.
- **No Harassment or Bullying**: Targeted harassment, abuse, or any attempts to intimidate others is unacceptable.

### 2. **Prohibited Content**

The following types of content are strictly prohibited on Loony:

- **Violent or Graphic Content**: Content that glorifies violence, harm, or death.
- **Pornographic or Sexually Explicit Material**: Any form of adult content, including sexually explicit or suggestive images, language, or themes.
- **Illegal Activities**: Content that encourages, promotes, or instructs on illegal activities, including drug use, fraud, hacking, or any other unlawful behavior.
- **Terrorism & Extremism**: Content that promotes terrorist organizations or activities, or any extremist ideologies.
  
### 3. **Intellectual Property Rights**

Users must respect intellectual property rights:

- **No Copyright Infringement**: Users are responsible for ensuring that the content they upload is either their own creation or used with proper permission. Do not upload plagiarized material, or use copyrighted images, text, or other media without proper attribution or permission.
- **Proper Attribution**: When referencing works, studies, or ideas that are not your own, provide appropriate credit to the original source.

### 4. **Spam and Misleading Content**

- **No Spam**: Posting repetitive content, using misleading titles or descriptions, or posting for the sole purpose of driving traffic to external sites is not allowed.
- **No Clickbait**: Content should accurately reflect its title, and users should not engage in deceptive practices to generate views or attention.
- **No Malicious Links**: Do not post links that lead to harmful websites, malware, or phishing attempts.

### 5. **Self-Promotion and Commercial Content**

While we encourage sharing and discovery, we maintain a balanced community:

- **Moderation of Self-Promotion**: You may share content that promotes your personal work or business, but overt commercial content or excessive self-promotion may be moderated. Engage meaningfully with the community and avoid spamming promotional links.
- **No Unauthorized Advertising**: Users are not permitted to use Loony as a platform for unsolicited advertisements or promotional campaigns unless specifically approved.

### 6. **Quality and Integrity of Content**

- **Fact-Based Writing**: While Loony encourages creativity and opinion, users must ensure that any claims or facts are accurate and responsibly sourced, especially in educational or journalistic contexts.
- **No Misinformation**: Deliberate dissemination of false information, hoaxes, or conspiracy theories is not permitted.

### 7. **User Safety and Privacy**

- **Respect Privacy**: Do not share private or personal information about others without their explicit consent, including addresses, phone numbers, or any other sensitive data.
- **Child Protection**: Content that exploits or endangers minors in any way will result in immediate removal and possible legal action. This includes, but is not limited to, child sexual abuse material, grooming behavior, or any form of child exploitation.

### 8. **Enforcement and Reporting**

Loony is committed to maintaining a high standard of content quality and user experience:

- **Moderation**: Content may be reviewed by our team to ensure compliance with this policy. We reserve the right to remove any content that violates these guidelines, and repeated violations may result in account suspension or banning.
- **Reporting**: If you encounter content that violates this policy, you are encouraged to report it. We will review all reports promptly and take appropriate action.

### 9. **Appeals**

If your content is removed or your account is suspended, you have the right to appeal the decision. Appeals will be reviewed on a case-by-case basis.

### 10. **Changes to the Content Policy**

This policy may be updated or modified from time to time. Users will be notified of any significant changes, and continued use of the platform constitutes acceptance of the revised policy.

---

By using **Loony**, you agree to follow this Content Policy. Thank you for helping us maintain a respectful, creative, and engaging community!

---`

const ContentPolicy = (): React.JSX.Element => {
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

export default ContentPolicy
