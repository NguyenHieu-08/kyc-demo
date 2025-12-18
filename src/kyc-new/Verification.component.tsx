import React, {forwardRef, useMemo, useRef} from 'react';
import {useSelector} from 'react-redux';
import GenericAccordion, {AccordionHandle, AccordionItem, AccordionSection} from "./generate-accordion-section";


export interface Verification extends AccordionSection {
    id: number;
    label: string;
    data: Array<AccordionItem & { isDisabled?: boolean }>;
}

const VerificationPurpose = forwardRef((props, ref) => {
    const accordionRef = useRef<AccordionHandle>(null);
    // Chỉ subscribe vào verificationPurpose, không subscribe vào toàn bộ state.kyc
    const verificationPurpose = useSelector((state: any) => state.kyc.verificationPurpose);

    // Expose methods to parent component
    React.useImperativeHandle(ref, () => ({
        // Chuẩn hóa API: dùng lại đúng các method từ GenericAccordion
        getData: () => accordionRef.current?.getData() || [],
        getOpenSections: () => accordionRef.current?.getOpenSections() || {},
        getSelectedItems: () => accordionRef.current?.getSelectedItems() || [],
    }));

    // Memoize sections để tránh tạo array mới mỗi lần render
    const sections = useMemo(() => {
        return [...(verificationPurpose || [])];
    }, [verificationPurpose]);

    // Memoize config để tránh tạo object mới mỗi lần render
    const config = useMemo(() => ({
        multipleOpen: true,
        autoOpenSelected: true,
        persistOpenState: true,
    }), []);

    return (
        <GenericAccordion
            ref={accordionRef}
            sections={sections}
            config={config}
        />
    );
});

VerificationPurpose.displayName = 'VerificationPurpose';

export default React.memo(VerificationPurpose);
