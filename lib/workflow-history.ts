import { createClient } from "./supabase/client"

// Custom validation function for UUID
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export interface WorkflowHistoryData {
  report_id: string
  action: string
  user_id: string
  status?: string
  notes?: string
}

export async function insertWorkflow(
  reportId: string,
  userId: string,
  action: string,
  notes?: string,
  status = "in_progress",
) {
  try {
    const supabase = createClient()

    if (!isValidUUID(reportId) || !isValidUUID(userId)) {
      console.error("[v0] Invalid UUID format for reportId or userId")
      throw new Error("Invalid UUID format for reportId or userId")
    }

    console.log("[v0] Inserting workflow history:", { reportId, userId, action, status, notes })

    const workflowData: WorkflowHistoryData = {
      report_id: reportId,
      action,
      user_id: userId,
      status,
      notes,
    }

    const { data, error } = await supabase
      .from("workflow_history")
      .insert([
        {
          ...workflowData,
          timestamp: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Error inserting workflow history:", error)
      throw error
    }

    console.log("[v0] Workflow history inserted successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Failed to insert workflow history:", error)
    return { success: false, error }
  }
}

// Helper function to get workflow action details based on transition type
export function getWorkflowActionDetails(transitionType: string) {
  const actionMap = {
    send_to_coordinator: {
      action: "forwarded_to_coordinator",
      notes: "Pengecekan dokumen",
      status: "in_progress",
    },
    assign_to_staff: {
      action: "assigned_to_staff",
      notes: "Dikerjakan staff",
      status: "in_progress",
    },
    return_to_coordinator: {
      action: "submitted_to_coordinator",
      notes: "Pengecekan dokumen",
      status: "in_progress",
    },
    complete_to_tu: {
      action: "returned_to_tu",
      notes: "Tugas selesai",
      status: "completed",
    },
    request_revision: {
      action: "revision_requested",
      notes: "Perlu revisi",
      status: "revision",
    },
    create_report: {
      action: "created",
      notes: "Laporan dibuat",
      status: "in_progress",
    },
  }

  return (
    actionMap[transitionType] || {
      action: transitionType,
      notes: "Workflow action",
      status: "in_progress",
    }
  )
}
