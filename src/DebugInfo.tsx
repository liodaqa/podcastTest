import { useEffect, useState } from 'react';

const DebugInfo = () => {
  const [envMode, setEnvMode] = useState('');
  const [secretKeyStatus, setSecretKeyStatus] = useState('');

  useEffect(() => {
    const IS_PRODUCTION = import.meta.env.MODE === 'production';
    const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || null;

    setEnvMode(IS_PRODUCTION ? 'Production' : 'Development');
    setSecretKeyStatus(SECRET_KEY ? '✔️ Exists' : '❌ MISSING');
  }, []);

  return (
    <div style={{ padding: '10px', background: '#eee', borderRadius: '5px' }}>
      <h3>Debug Info</h3>
      <p>
        <strong>Mode:</strong> {envMode}
      </p>
      <p>
        <strong>Secret Key:</strong> {secretKeyStatus}
      </p>
    </div>
  );
};

export default DebugInfo;
