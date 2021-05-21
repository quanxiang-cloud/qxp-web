// import React, { useEffect, useState } from 'react';

// import httpClient from '@lib/http-client';
// import PageLoading from '@c/page-loading';

// import FormAppDataContent from './form-app-data-content';
// import FormAppDataStore from './store';

// type Props = {
//   appID: string;
//   pageID: string;
//   pageName: string;
//   className?: string;
//   style?: React.CSSProperties
// }

// function SchemeWrap({ appID, pageID, pageName, ...props }:Props) {
//   const [store, setStore] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     setLoading(true);
//     httpClient(`/api/v1/structor/${appID}/schema/${pageID}`).then((res:any)=>{
//       const { schema, config } = res.schema;
//       setStore(new FormAppDataStore({ schema, config, pageID, appID, pageName }));
//       setLoading(false);
//       console.log('res: ', res);
//     }).catch(()=>{
//       setLoading(false);
//     });
//   }, [appID, pageID]);

//   if (loading) {
//     return <PageLoading />;
//   }

//   return (
//     <>
//       <FormAppDataContent {...props} store={store} />
//     </>
//   );
// }

// export default SchemeWrap;
