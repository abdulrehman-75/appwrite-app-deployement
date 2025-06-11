import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'

function RTE({
    name = "content",
    control,
    label,
    defaultValue = ""
}) {
    return (
        <div className="w-full mb-6">
            {label && (
                <label className="block mb-2 text-sm font-medium text-white">
                    {label}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange, value } }) => (
                    <Editor
                        apiKey='ja4w7c3yz5oq797mjxdg0w2ok0992is8wvefp51591pl5kqb'
                        value={value}
                        init={{
                            height: 400,
                            menubar: false,
                            branding: false,
                            skin: 'oxide-dark',
                            content_css: 'dark',
                            plugins: [
                                'autolink', 'link', 'lists', 'media', 'image',
                                'charmap', 'preview', 'fullscreen', 'code',
                                'emoticons', 'table', 'help', 'wordcount'
                            ],
                            toolbar:
                                'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | ' +
                                'bullist numlist outdent indent | link image media | code fullscreen',
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color:#1f1f1f; color:#fff; }",
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />
        </div>
    )
}

export default RTE
