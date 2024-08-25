import MarkdownPreview from '@uiw/react-markdown-preview';

const body = `## Loony Content Policy

Loony is a platform for sharing ideas, stories, and insights. We are committed to fostering an open and respectful environment where diverse voices can contribute and engage. To ensure the quality and safety of the content shared on Loony, we have established the following content policy.

### 2. **Content Guidelines**

- **Respectful Communication**: Content should be written respectfully, considering the diversity of our community. Hate speech, harassment, and content promoting violence or discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or any other protected characteristic are strictly prohibited.
- **Originality and Plagiarism**: All content posted on Loony must be original. Plagiarism, including the use of another person's work or ideas without proper attribution, is not allowed.
- **Intellectual Property**: Respect the intellectual property rights of others. Do not post content that infringes on copyrights, trademarks, or other proprietary rights. Properly attribute any external sources used in your content.
- **Accuracy and Honesty**: Content must be accurate and not misleading. Do not post false or deceptive information, and avoid sensationalism or clickbait that misrepresents the content's true nature.
- **No Harmful Content**: Content that promotes self-harm, eating disorders, suicide, or any other form of harmful behavior is not permitted.
- **Mature Content**: Content containing explicit material, including violence, pornography, or other adult content, must be clearly marked as mature. Content that is excessively violent, gory, or sexual in nature is not allowed.

### 3. **User Behavior**

- **Constructive Feedback**: Engage with others in a constructive manner. Criticism should be provided respectfully and with the intent of fostering growth and discussion.
- **No Trolling or Spamming**: Do not engage in trolling, flaming, or any other behavior that disrupts the community. Spamming, including repetitive posting, mass messaging, or irrelevant content, is prohibited.
- **Privacy**: Respect the privacy of others. Do not post personal information (e.g., home addresses, phone numbers, financial information) without explicit consent.

### 4. **Content Removal and Moderation**

- **Reporting Violations**: Users are encouraged to report content that violates this policy. Our moderation team will review reports and take appropriate action, including content removal and account suspension if necessary.
- **Content Moderation**: Loony reserves the right to remove any content that violates this policy or is deemed inappropriate for the platform. Users may appeal content removals through our moderation review process.
- **Account Termination**: Repeated violations of this policy may result in the termination of the user's account.

### 5. **Legal Compliance**

- **Compliance with Laws**: Users must comply with all applicable laws and regulations when using Loony. Do not post content that is illegal or promotes illegal activities.
- **Law Enforcement**: Loony may cooperate with law enforcement authorities in cases of criminal activity or threats to public safety.

### 6. **Updates to the Policy**

This content policy may be updated periodically. Users will be notified of significant changes, and continued use of Loony constitutes acceptance of the revised policy.

### 7. **Contact Information**
`;

const ContentPolicy = () => {
  return (
    <div className='home-container'>
      <div style={{ width: '60%', marginRight: 'auto', marginLeft: 'auto' }}>
        <MarkdownPreview source={body} wrapperElement={{ 'data-color-mode': 'light' }} />
      </div>
    </div>
  );
};

export default ContentPolicy;
