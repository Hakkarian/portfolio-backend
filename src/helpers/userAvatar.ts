import crypto from 'crypto';
import gravatar from 'gravatar';

export const userAvatar = (data: any) => {
    const md5Hash = crypto.createHash('md5').update(data.trim().toLowerCase()).digest('hex');
    return gravatar.url(md5Hash, { s: '40', r: 'pg', d: 'identicon' });
}