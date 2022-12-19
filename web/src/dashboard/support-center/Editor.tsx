import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Typography } from '@material-ui/core';
import { useMutation } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import Link from 'next/link';
import { postReply, updateReply } from '../../apis/support/support';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  toBestAssitYOuText: <IntlMessages id={'toBestAssitYOuText'} />,
  reply: <IntlMessages id={'reply'} />,
  browser: <IntlMessages id={'browser'} />,
  cancel: <IntlMessages id={'cancel'} />,
  noFileSelected: <IntlMessages id={'noFileSelected'} />,
  status: <IntlMessages id={'status'} />,
  postedOn: <IntlMessages id={'postedOn'} />,
  ticket: <IntlMessages id={'ticket'} />,
  type: <IntlMessages id={'type'} />,
};

export default function FullWidthTabs({ supportTicketId, refetchReply }: { supportTicketId: string; refetchReply: any }) {
  const [content, updateContent] = useState({} as any);
  const updateContentHandler = (key: string, value: any) => {
    updateContent({ ...content, [key]: value });
  };

  const {
    mutateAsync: mutateAsyncPostRply,
    isSuccess: isSuccessPostRply,
    isError: isErrorPostRply,
    error: postRplyError,
    isLoading: isLoadingPostRply,
    data: PostRplyData,
  } = useMutation(postReply);

  const {
    mutateAsync: mutateAsyncUpdateReply,
    isSuccess: isSuccessUpdateReply,
    isError: isErrorUpdateReply,
    error: updateReplyError,
    isLoading: isLoadingUpdateReply,
    data: updateReplyData,
  } = useMutation(updateReply);

  const replyHandler = () => {
    if (content._id) {
      mutateAsyncUpdateReply(content);
    } else {
      mutateAsyncPostRply({ ...content, supportTicketId });
    }
  };

  // Re-directing after success==
  useEffect(() => {
    if (updateReplyData?.success || PostRplyData?.success) {
      refetchReply();
      updateContent({ comment: '' });
    }
  }, [isSuccessUpdateReply, isSuccessPostRply]);

  return (
    <div>
      <div>
        <Typography gutterBottom>{switchData.toBestAssitYOuText}</Typography>
      </div>
      <Editor
        initialValue={''}
        value={content.comment}
        apiKey="p1bylae99q4eca5xa0pa7eando0vekbc46lcpwq3azoaifqq"
        init={{
          height: 200,
          min_height: 200,
          width: '100%',
          marginTop: '10',
          menubar: false,
          branding: false,
          remove_script_host: true,
          relative_urls: false,
          document_base_url: 'http://www.localhost:4003/',
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            ' image undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help image',
        }}
        onEditorChange={(e) => updateContentHandler('comment', e)}
      />
      {/* <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Button variant="contained" style={{ marginRight: 10, paddingLeft: 10 }}>
          {switchData.browser}
        </Button>
        <span>{switchData.noFileSelected} </span>
      </div> */}
      <div style={{ display: 'flex', width: '100%', marginTop: 10, justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={replyHandler} style={{ marginRight: 5 }}>
          {switchData.reply}
        </Button>
        <Link href="/dashboard/support-center">
          <Button variant="contained" color="secondary" style={{ marginRight: 5 }}>
            {switchData.cancel}
          </Button>
        </Link>
      </div>
      <NotificationLoader
        message={(PostRplyData?.success && PostRplyData?.msg) || (updateReplyData?.success && updateReplyData?.msg)}
        loading={isLoadingUpdateReply || isLoadingPostRply}
        error={JSON.stringify(PostRplyData?.errors) || JSON.stringify(updateReplyData?.errors)}
      />
    </div>
  );
}
