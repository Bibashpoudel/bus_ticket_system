import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@material-ui/core';
import { useMutation, useQuery } from 'react-query';
import { addCms, getCmsList, updateCms } from '../../../apis/settings/cms/Index';
import { NotificationLoader } from '../../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  save: <IntlMessages id={'save'} />,
  update: <IntlMessages id={'update'} />,
  choose: <IntlMessages id={'choose'} />,
};

export default function FullWidthTabs({ language, type }: { language: string; type: string }) {
  const [content, updateContent] = useState({} as any);
  const [initialContentValue, updateInitialContentValue] = useState({ english: 'test english' } as any);

  console.log('initialValue', initialContentValue);
  const updateContentHandler = (contentValue: string) => {
    updateContent({ ...content, [language]: contentValue });
  };

  console.log('content', content);

  const {
    mutateAsync: mutateAsyncSaveCms,
    isSuccess: isSuccessSaveCms,
    isError: errorSaveCms,
    isLoading: isLoadingSaveCms,
    data: saveCmsData,
  } = useMutation(addCms);

  const {
    mutateAsync: mutateAsyncUpdateCms,
    isSuccess: isSuccessUpdateCms,
    isError: isErrorUpdateCms,
    error: errorUpdateCms,
    isLoading: isLoadingUpdateCms,
    data: updateCmsData,
  } = useMutation(updateCms);

  const saveHandler = () => {
    console.log('save handler called', content);
    if (initialContentValue?._id) {
      mutateAsyncUpdateCms({ ...initialContentValue, ...content });
    } else {
      mutateAsyncSaveCms({ ...content, type, description: 'No Description' });
    }
  };

  const {
    refetch,
    isSuccess: isSuccessCmsList,
    isError: isErrorCmsList,
    error: ErrorCsmList,
    isLoading: isLoadingCmsList,
    data: cmsDataList,
  } = useQuery(['getCmsList'], getCmsList);

  useEffect(() => {
    if (cmsDataList && cmsDataList.success) {
      updateInitialContentValue(cmsDataList.data?.find((d: any) => d.type === type));
    }
  }, [cmsDataList, isSuccessCmsList]);

  console.log('current cms', cmsDataList, initialContentValue);

  useEffect(() => {
    console.log('replace the intitail value with content value');
    if (content && content?.english) {
      updateInitialContentValue({ ...initialContentValue, ...content });
    }
  }, [language]);

  return (
    <div>
      <Editor
        initialValue={`<p>${initialContentValue?.[language]}</p>`}
        value={content?.[language]}
        apiKey="p1bylae99q4eca5xa0pa7eando0vekbc46lcpwq3azoaifqq"
        init={{
          height: '700',
          width: '100%',
          marginTop: '10',
          menubar: true,
          branding: false,
          remove_script_host: true,
          relative_urls: false,
          document_base_url: 'http://localhost:3000',
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            ' image undo redo | fontsizeselect | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help image',
          fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt',
        }}
        onEditorChange={(contentValue) => updateContentHandler(contentValue)}
      />

      <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', marginTop: 10 }}>
        <Button variant="contained" color="primary" onClick={saveHandler}>
          {switchData.save}
        </Button>
      </div>
      <NotificationLoader
        message={(saveCmsData?.success && saveCmsData?.msg) || (updateCmsData?.success && updateCmsData?.msg)}
        loading={isLoadingSaveCms || isLoadingUpdateCms}
        error={JSON.stringify(saveCmsData?.errors) || JSON.stringify(updateCmsData?.errors)}
      />
    </div>
  );
}
