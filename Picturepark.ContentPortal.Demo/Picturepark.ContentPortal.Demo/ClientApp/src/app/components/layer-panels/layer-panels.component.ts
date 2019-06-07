import { Component, OnInit, Input } from '@angular/core';
import {
  SchemaDetail, ContentDetail, FieldMultiTagbox, FieldSingleTagbox, FieldString, FieldTranslatedString, FieldBoolean
} from '@picturepark/sdk-v1-angular';
import { FieldDetailInfoDialogComponent } from './field-detail-info-dialog/field-detail-info-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-layer-panels',
  templateUrl: './layer-panels.component.html',
  styleUrls: ['./layer-panels.component.scss']
})
export class LayerPanelsComponent implements OnInit {

  @Input()
  public schemas: SchemaDetail[];

  @Input()
  public content: ContentDetail;

  public layers: {
    layer: string;
    items: {
      field: string;
      value?: string;
      values?: {
        value: string,
        tooltip: string
      }[]
    }[]
  }[];

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.layers = [];
    const contentSchema = this.schemas.find(i => i.id === this.content.contentSchemaId);

    contentSchema.layerSchemaIds.forEach(layerSchemaId => {
      if (this.content.layerSchemaIds.indexOf(layerSchemaId) === -1) {
        return;
      }

      const schema = this.schemas.find(i => i.id === layerSchemaId);
      const schemaMetadata = this.content.metadata[this.toLowerCamel(schema.id)];

      const layer = {
        layer: schema.names['x-default'],
        items: []
      };
      schema.fields.forEach(field => {
        if (schemaMetadata[field.id]) {
          let value = '';
          let values = [];
          const fieldValue = schemaMetadata[field.id];

          switch (field.constructor) {
            case FieldMultiTagbox:
              values = fieldValue.map(i => {
                return { value: i.displayValue.name, tooltip: i.displayValue.thumbnail };
              });
              break;
            case FieldSingleTagbox:
              values = [{
                value: fieldValue.displayValue.name,
                tooltip: fieldValue.displayValue.thumbnail
              }];
              break;
            case FieldBoolean:
              value = fieldValue ? 'Yes' : 'No';
              break;
            case FieldString:
              value = fieldValue;
              break;
            case FieldTranslatedString:
              value = fieldValue['x-default'];
              break;
          }

          layer.items.push({
            field: field.names['x-default'],
            value: value,
            values: values
          });
        }
      });
      this.layers.push(layer);
    });
  }

  showItem(item: any, event: any) {
    let dialogRef: MatDialogRef<FieldDetailInfoDialogComponent>;
    dialogRef = this.dialog.open(FieldDetailInfoDialogComponent, {
      width: '450px'
    });
    dialogRef.componentInstance.title = item.value;
    dialogRef.componentInstance.message = item.tooltip;
  }

  toLowerCamel(value: string): string {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }
}
