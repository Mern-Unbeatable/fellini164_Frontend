function formatTimeAgo(iso) {
  if (!iso) return '';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function mapNotificationFromApi(api) {
  const timestamp = api.sentAt || api.createdAt;

  return {
    id: api.id,
    title: api.title || '',
    message: api.message || '',
    type: api.type || 'INFO',
    time: formatTimeAgo(timestamp),
    unread: !api.readAt,
    date: timestamp ? String(timestamp).slice(0, 10) : '',
    sentAt: api.sentAt,
    readAt: api.readAt,
    data: api.data,
  };
}

export function parseNotificationsResponse(response) {
  const body = response?.data ?? response;
  const list = body?.notifications ?? [];

  return {
    notifications: Array.isArray(list) ? list.map(mapNotificationFromApi) : [],
    total: body?.total ?? list.length,
    count: body?.count ?? list.length,
  };
}
