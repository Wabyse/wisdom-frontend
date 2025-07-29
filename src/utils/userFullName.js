export const userFullName = (userInfo, language) => {
    if (!userInfo) return language ? 'User' : 'مستخدم';
    return String(userInfo?.name);
};