import { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import { api, getAuthToken } from '../services/api';

const ICONS = {
  informativo: FiInfo,
  sucesso: FiCheckCircle,
  atencao: FiAlertCircle,
  urgente: FiAlertCircle,
};

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (!getAuthToken()) return;
    api.getAnnouncements().then(setAnnouncements).catch(() => {});
  }, []);

  if (!announcements.length) return null;
  const announcement = announcements[0];
  const Icon = ICONS[announcement.tom] || FiInfo;
  return (
    <aside className={`platform-announcement tone-${announcement.tom}`} role="status">
      <Icon />
      <div><strong>{announcement.titulo}</strong><span>{announcement.mensagem}</span></div>
      {announcement.link_url && <a href={announcement.link_url}>{announcement.link_texto || 'Saiba mais'}</a>}
      <button type="button" aria-label="Fechar aviso" onClick={() => setAnnouncements([])}><FiX /></button>
    </aside>
  );
};

export default AnnouncementBanner;
