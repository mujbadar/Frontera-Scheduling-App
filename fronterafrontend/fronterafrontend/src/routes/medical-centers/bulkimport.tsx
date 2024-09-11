import { Button } from "../../../components/ui/button";
import Modal from "../../../components/modal";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useState } from "react";

import {
  TBulkImportTarget,
  useBulkImport,
} from "@/providers/bulkImportProvider";
import Loading from "../../../components/loading";

export default function BulkImport({ target }: { target: TBulkImportTarget }) {
  const [isOpen, setIsOpen] = useState<boolean | undefined>();

  const {
    import_centers,
    centers_bulk_import_status,
    providers_bulk_import_status,
    import_providers,
  } = useBulkImport();

  const [bulkImportFile, setBulkImportFile] = useState<File | undefined>();

  return (
    <div className="flex items-center gap-2">
      <Modal
        customClose={isOpen}
        actionTitle="Bulk Import from csv"
        description="Import medical centers from a csv file all at once"
        title="Bulk Import"
        triggerTitle="Bulk Import"
      >
        <Label
          htmlFor="bulk-import-center-input"
          className="py-1 text cursor-pointer rounded-lg text-center text-lg font-semibold text-white bg-hms-green-light hover:bg-hms-green-dark"
        >
          choose file
          <Input
            accept=".xlsx"
            type="file"
            id="bulk-import-center-input"
            className="hidden"
            onChange={(e) => {
              if (e.target?.files) {
                setBulkImportFile(e.target?.files[0]);
              }
            }}
          />
        </Label>
        {bulkImportFile ? (
          <div>
            <p className="text-lg">
              Import {target.toLocaleLowerCase()}s from
              <span className="bg-hms-green-bright text-hms-green-dark py-1 px-2 rounded-lg font-semibold">
                {bulkImportFile.name}
              </span>
            </p>
            {target === "CENTER" ? (
              <div>
                {centers_bulk_import_status === "pending" ? (
                  <Loading message="Currently import providers" />
                ) : (
                  <Button
                    onClick={() => {
                      if (import_centers) {
                        import_centers({ file: bulkImportFile });
                        setIsOpen(undefined);
                      }
                    }}
                    className="px-4 py-1 rounded-lg text-white bg-hms-green-dark hover:bg-hms-green-light float-right my-2"
                  >
                    Confirm
                  </Button>
                )}
              </div>
            ) : (
              <div>
                {providers_bulk_import_status === "pending" ? (
                  <Loading message="Currently import providers" />
                ) : (
                  <Button
                    onClick={() => {
                      if (import_providers) {
                        import_providers({ file: bulkImportFile });
                        setIsOpen(undefined);
                      }
                    }}
                    className="px-4 py-1 rounded-lg text-white bg-hms-green-dark hover:bg-hms-green-light float-right my-2"
                  >
                    Confirm
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
