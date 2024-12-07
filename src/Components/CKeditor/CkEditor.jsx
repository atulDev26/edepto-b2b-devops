import React, { Component } from 'react';
import CKEditor from "ckeditor4-react";


class CkEditor extends Component {
    constructor() {
        super();
        this.state = {
            data: this.props?.editorData ?? ""
        };
        // CKEditor.editorUrl =
        //     "https://cdn.ckeditor.com/4.16.0/standard-all/ckeditor.js";
    }

    onEditorChange = (e) => {
        const newData = e.editor.getData();
        this.setState({
            data: newData
        });

        if (this.props.onDataChange) {
            this.props.onDataChange(newData);
        }
    };

    render() {
        return (
            <>
                <CKEditor
                    data={this.props.editorData}
                    onChange={this.onEditorChange}
                    config={{
                        extraPlugins: "ckeditor_wiris,mathjax",
                        // removePlugins:
                        //     "filetools,uploadimage,uploadwidget,uploadfile,filebrowser,easyimage",
                        allowedContent: true,
                        mathJaxLib: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML",
                    }}
                    onBeforeLoad={(CKEDITOR) => {
                        CKEDITOR.plugins.addExternal(
                            "ckeditor_wiris",
                            "/mathtype-ckeditor4/",
                            "plugin.js"
                        );
                    }}
                />

                {(this.props.isPreview ?? true) && <div className="editor-preview">
                    {/* <h2>Rendered content</h2> */}
                    <div dangerouslySetInnerHTML={{ __html: this.state.data }}></div>
                </div>
                }
            </>
        );
    }
}

export default CkEditor;