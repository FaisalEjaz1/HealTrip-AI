import React from 'react';
import { ToolExecutionRecord, MessageItem } from '../types/index.js';
import { Cpu, Clock, CheckCircle2, ShieldAlert, Activity, FileJson } from 'lucide-react';

interface TelemetryDrawerProps {
  messages: MessageItem[];
  language: 'en' | 'ar';
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({ messages, language }) => {
  // Extract all tool execution records across messages
  const allExecutions: {
    msgId: string;
    timestamp: string;
    tool: ToolExecutionRecord;
    triageLevel?: string;
  }[] = [];

  messages.forEach((msg) => {
    if (msg.agentData?.toolExecutions) {
      msg.agentData.toolExecutions.forEach((tool) => {
        allExecutions.push({
          msgId: msg.id,
          timestamp: tool.timestamp || msg.timestamp,
          tool,
          triageLevel: msg.agentData?.triageLevel
        });
      });
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {language === 'ar' ? 'سجلات ومراقبة أدوات الوكيل الذكي (Telemetry)' : 'AI Agent Telemetry & Tool Call Audit Trail'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              Live Audit Log
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'ar'
              ? 'تتبع فوري لكل استدعاء للأدوات (Function Calls)، المعاملات المرسلة، سرعة الاستجابة، والتحقق من منع الهلوسة.'
              : 'Real-time observability into function invocations, parameter passing, execution latency, and anti-hallucination validation.'}
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-teal-700">{allExecutions.length}</div>
          <div className="text-[11px] text-slate-400 font-medium">Tools Executed</div>
        </div>
      </div>

      {allExecutions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No tool executions recorded yet</h4>
          <p className="text-xs text-slate-500 mt-1">
            Start a consultation in the Patient Consultation tab to inspect live tool executions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allExecutions.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden text-xs"
            >
              {/* Header */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {item.tool.tool_name}()
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{item.tool.duration_ms} ms</span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{item.tool.items_matched} items matched</span>
                  </span>
                </div>
              </div>

              {/* Payload Breakdown */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-2">
                    <FileJson className="w-4 h-4 text-teal-600" />
                    <span>Tool Arguments (JSON Payload):</span>
                  </div>
                  <pre className="p-3 bg-slate-900 text-teal-300 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(item.tool.input_args, null, 2)}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Database Execution & Triage Rationale:</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 space-y-2">
                    <p className="font-medium text-slate-900">{item.tool.output_summary}</p>
                    {item.triageLevel && (
                      <div className="pt-2 border-t border-slate-200 text-[11px] flex items-center justify-between">
                        <span className="text-slate-500">Evaluated Urgency:</span>
                        <span className="font-bold text-teal-800">{item.triageLevel}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
