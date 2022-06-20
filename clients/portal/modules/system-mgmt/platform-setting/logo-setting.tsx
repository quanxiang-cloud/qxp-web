import React, { useEffect, useState } from 'react';

import { ImgUploader } from '@c/file-upload';
import { Button } from '@one-for-all/ui';
import { setGlobalConfig } from '@lib/configuration-center';
import toast from '@lib/toast';
import PageLoading from '@c/page-loading';
import { useConfig } from '@lib/hooks';
import Input from '@portal/modules/apps-management/pages/page-design/blocks/node-carve/style-station/style-mirror/components/style-input';
import SubTitle from '@portal/modules/apps-management/pages/page-design/blocks/node-carve/style-station/style-mirror/components/style-sub-title';

export type PlatformBaseInfo = {
  platformName?: string;
  portalLogo?: string;
  homeLogo?: string;
}

export const platformConfig = {
  platformName: '',
  portalLogo: '',
  homeLogo: '',
};

export const PLATFORM_BASE_INFO_KEY = 'PLATFORM_NAME_LOGOS';
export const VERSION = '1.1.0';

function LogoSetting(): JSX.Element {
  const [platformName, setName] = useState<string>('');
  const [logos, setLogos] = useState<Omit<PlatformBaseInfo, 'platformName'>>(platformConfig);

  const [config, loading] = useConfig<PlatformBaseInfo>(
    PLATFORM_BASE_INFO_KEY,
    VERSION,
    platformConfig,
  );

  useEffect(() => {
    if (!config) return;
    setLogos(config);
    setName(config?.platformName || '');
  }, [config]);

  function onNameChange(value: string): void {
    setName(value);
  }

  function handleLogosUploadSuccess(file: QXPUploadFileBaseProps, type: string): void {
    setLogos((prevLogos) => ({
      ...prevLogos,
      [type]: file.uid,
    }));
  }

  function handleLogosDelete(type: string): void {
    setLogos((prevLogos) => ({
      ...prevLogos,
      [type]: '',
    }));
  }

  function handleSave(): void {
    setGlobalConfig(PLATFORM_BASE_INFO_KEY, VERSION, {
      ...logos,
      platformName,
    });
    toast.success('保存成功, 刷新页面后生效');
  }

  function genLogoInfo(
    logos: Omit<PlatformBaseInfo, 'platformName'>,
    type: keyof Omit<PlatformBaseInfo, 'platformName'>,
  ): QXPUploadFileBaseProps[] {
    const uid = logos[type];
    if (!uid) return [];
    return [{
      name: type,
      uid,
      type: 'image/png',
      size: 0,
    }];
  }

  if (loading) return <PageLoading />;

  return (
    <div className='flex-1 flex flex-col gap-20'>
      <Input
        style={{ gap: 10 }}
        labelClassName='text-16 font-semibold'
        className='w-280'
        value={platformName}
        name='platformName'
        label='平台名称:'
        onChange={onNameChange}
      />
      <div className='flex flex-col gap-10'>
        <SubTitle titleClassName='text-16 font-semibold' title='平台Logo:'/>
        <div className='flex items-center gap-100'>
          <div className='flex flex-col gap-5'>
            <SubTitle title='管理端图标'/>
            <ImgUploader
              originalThumbnail
              isPrivate={false}
              additionalPathPrefix='portalLogo'
              fileData={genLogoInfo(logos, 'portalLogo')}
              iconName="image"
              maxFileSize={5}
              accept={['image/png']}
              onFileSuccess={(file) => handleLogosUploadSuccess(file, 'portalLogo')}
              onFileDelete={() => handleLogosDelete('portalLogo')}
            />
          </div>
          <div className='flex flex-col gap-8'>
            <SubTitle title='用户端图标'/>
            <ImgUploader
              originalThumbnail
              isPrivate={false}
              additionalPathPrefix='homeLogo'
              fileData={genLogoInfo(logos, 'homeLogo')}
              iconName="image"
              maxFileSize={5}
              accept={['image/png']}
              onFileSuccess={(file) => handleLogosUploadSuccess(file, 'homeLogo')}
              onFileDelete={() => handleLogosDelete('homeLogo')}
            />
          </div>
        </div>
        <SubTitle className='tracking-wide' title='仅支持上传 png 格式的图片, 大小不超过 5 MB'/>
        <span>
          <Button onClick={handleSave} modifier='primary'>保存</Button>
        </span>
      </div>
    </div>
  );
}

export default LogoSetting;
