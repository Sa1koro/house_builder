/** 预置公开示例房（见 houses/demo-90sqm/ 与 packages/supabase/seed.sql，ID 固定） */
export const DEMO_HOUSE_ID = "00000000-0000-4000-8000-00000000d001";
export const DEMO_PROPOSAL_AES_ID = "00000000-0000-4000-8000-0000000000ae";
export const DEMO_PROPOSAL_A5S_ID = "00000000-0000-4000-8000-0000000000a5";

export const DEMO_COMPARE_URL = `/houses/${DEMO_HOUSE_ID}/compare?a=${DEMO_PROPOSAL_AES_ID}&b=${DEMO_PROPOSAL_A5S_ID}`;
