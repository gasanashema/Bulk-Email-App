import { useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent } from '../ui/Card';
import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import type { Signature } from '../../types';
import { cn } from '../../lib/utils';

export function SignatureManager() {
  const { state, dispatch } = useWizard();
  const [isCreating, setIsCreating] = useState(false);
  const [newSig, setNewSig] = useState<Partial<Signature>>({ name: 'My Signature' });

  const handleCreate = () => {
      if (!newSig.fullName) return; // minimal validation

      const signature: Signature = {
          id: Date.now().toString(),
          name: newSig.name || 'Untitled Signature',
          fullName: newSig.fullName,
          jobTitle: newSig.jobTitle,
          companyName: newSig.companyName,
          email: newSig.email,
          phone: newSig.phone,
          website: newSig.website
      };

      dispatch({ type: 'ADD_SIGNATURE', payload: signature });
      dispatch({ type: 'SELECT_SIGNATURE', payload: signature.id });
      setIsCreating(false);
      setNewSig({ name: 'My Signature' });
  };



  return (
    <div className="space-y-6 max-w-3xl mx-auto">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Email Signature</h2>
           <p className="text-slate-500">Create a professional signature to append to your emails.</p>
       </div>

       {isCreating ? (
           <Card className="border-blue-200 shadow-md">
               <CardContent className="p-6 space-y-4">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="font-semibold text-lg text-blue-900">New Signature</h3>
                       <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Input 
                            label="Internal Name (e.g. Work)" 
                            placeholder="Work Signature"
                            value={newSig.name}
                            onChange={(e) => setNewSig({...newSig, name: e.target.value})}
                        />
                       <Input 
                            label="Full Name" 
                            placeholder="John Doe"
                            value={newSig.fullName}
                            onChange={(e) => setNewSig({...newSig, fullName: e.target.value})}
                        />
                       <Input 
                            label="Job Title" 
                            placeholder="Product Manager"
                            value={newSig.jobTitle}
                            onChange={(e) => setNewSig({...newSig, jobTitle: e.target.value})}
                        />
                       <Input 
                            label="Company" 
                            placeholder="ACME Inc."
                            value={newSig.companyName}
                            onChange={(e) => setNewSig({...newSig, companyName: e.target.value})}
                        />
                       <Input 
                            label="Email" 
                            placeholder="john@acme.com"
                            value={newSig.email}
                            onChange={(e) => setNewSig({...newSig, email: e.target.value})}
                        />
                       <Input 
                            label="Phone" 
                            placeholder="+1 555 0123"
                            value={newSig.phone}
                            onChange={(e) => setNewSig({...newSig, phone: e.target.value})}
                        />
                       {/* Website / Socials could go here */}
                   </div>

                   <div className="pt-4 flex justify-end">
                       <Button onClick={handleCreate} disabled={!newSig.fullName}>Save Signature</Button>
                   </div>
               </CardContent>
           </Card>
       ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Add New Button Card */}
               <button 
                onClick={() => setIsCreating(true)}
                className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-slate-50 transition-all group h-48"
               >
                   <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                       <Plus className="w-6 h-6" />
                   </div>
                   <span className="font-medium text-slate-600">Create New Signature</span>
               </button>

               {/* Existing Signatures */}
               {state.signatures.map(sig => (
                   <div 
                    key={sig.id}
                    onClick={() => dispatch({ type: 'SELECT_SIGNATURE', payload: sig.id })}
                    className={cn(
                        "relative p-6 rounded-lg border-2 bg-white cursor-pointer transition-all h-48 flex flex-col hover:shadow-md",
                        state.selectedSignatureId === sig.id 
                            ? "border-blue-500 ring-4 ring-blue-50/50" 
                            : "border-slate-200 hover:border-slate-300"
                    )}
                   >
                       {state.selectedSignatureId === sig.id && (
                           <div className="absolute top-2 right-2 text-blue-500 bg-blue-50 rounded-full p-1">
                               <Check className="w-4 h-4" />
                           </div>
                       )}
                       
                       <h3 className="font-semibold text-slate-900 mb-2">{sig.name}</h3>
                       
                       <div className="flex-1 space-y-1 text-sm text-slate-500 border-t pt-3 mt-1">
                           <p className="font-medium text-slate-800">{sig.fullName}</p>
                           {sig.jobTitle && <p>{sig.jobTitle}{sig.companyName && ` @ ${sig.companyName}`}</p>}
                           <p className="text-xs pt-2">
                               {sig.email} • {sig.phone}
                           </p>
                       </div>
                   </div>
               ))}
           </div>
       )}

        <div className="flex justify-between pt-8 border-t border-slate-100">
            <Button variant="outline" onClick={() => dispatch({ type: 'PREV_STEP' })}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
             <Button onClick={() => dispatch({ type: 'NEXT_STEP' })}>
                Next: Branding <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
    </div>
  );
}
