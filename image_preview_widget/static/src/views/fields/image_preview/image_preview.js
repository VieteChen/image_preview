/** @odoo-module **/
import { ImageField, imageFiled } from '@web/views/fields/image/image_field';
import { useFileViewer } from "@web/core/file_viewer/file_viewer_hook";
import { registry } from "@web/core/registry";
import { _t } from "@web/core/l10n/translation";
import { isBinarySize } from "@web/core/utils/binary";


export class ImagePreviewField extends ImageField {
    static template = "image_preview_widget.ImagePreviewField";
    setup() {
        super.setup();
        this.fileViewer = useFileViewer();
    }
    onClickImage() {
        if (!this.props.record.data[this.props.name]){
            return;
        }
        const attachment = {defaultSource: this.lastURL, isViewable:true, isImage:true, displayName: ''}
        if (isBinarySize(this.props.record.data[this.props.name])) {
            attachment['downloadUrl'] = this.lastURL;
        }
        const attachments = [attachment];
        this.fileViewer.open(attachment, attachments);
    }
}


export const imagePreviewField = {
    component: ImagePreviewField,
    displayName: _t("Image"),
    supportedOptions: [
        {
            label: _t("Reload"),
            name: "reload",
            type: "boolean",
            default: true,
        },
        {
            label: _t("Enable zoom"),
            name: "zoom",
            type: "boolean",
        },
        {
            label: _t("Zoom delay"),
            name: "zoom_delay",
            type: "number",
            help: _t("Delay the apparition of the zoomed image with a value in milliseconds"),
        },
        {
            label: _t("Accepted file extensions"),
            name: "accepted_file_extensions",
            type: "string",
        },
        {
            label: _t("Size"),
            name: "size",
            type: "selection",
            choices: [
                { label: _t("Small"), value: "[0,90]" },
                { label: _t("Medium"), value: "[0,180]" },
                { label: _t("Large"), value: "[0,270]" },
            ],
        },
        {
            label: _t("Preview image"),
            name: "preview_image",
            type: "field",
            availableTypes: ["binary"],
        },
    ],
    supportedTypes: ["binary"],
    fieldDependencies: [{ name: "write_date", type: "datetime" }],
    isEmpty: () => false,
    extractProps: ({ attrs, options }) => ({
        enableZoom: options.zoom,
        zoomDelay: options.zoom_delay,
        previewImage: options.preview_image,
        acceptedFileExtensions: options.accepted_file_extensions,
        width: options.size && Boolean(options.size[0]) ? options.size[0] : attrs.width,
        height: options.size && Boolean(options.size[1]) ? options.size[1] : attrs.height,
        reload: "reload" in options ? Boolean(options.reload) : true,
    }),
};


registry.category("fields").add("image_preview", imagePreviewField);
