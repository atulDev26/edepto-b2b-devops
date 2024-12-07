import React, { useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { TOKEN } from '../api/localStorageKeys';
import { hasAccess } from '../utils/StaticData/accessList';

const PrivateRoute = ({ accessKeyList }) => {

  let localAccess = accessKeyList?.some((item) => hasAccess(item));

  const token = TOKEN();
  const authToken = useMemo(() => token, [token])
  if (!authToken) {
    return <Navigate to='/' />;
  }

  if (!localAccess) {
    return <Navigate to='/setting' />;
  }
  return <Outlet />;
}

export default PrivateRoute