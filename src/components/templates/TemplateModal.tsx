
import { MdWidgets, MdCalendarToday, MdPerson, MdCategory, MdTag, MdImage } from "react-icons/md";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CreateNewCanvas from "../common/CreateNewCanvas";
import { canvasPresets } from "@/lib/constants";


const TemplateModal = ({ template, isOpen, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-3xl lg:min-w-4xl h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="flex h-full">
          <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-8">
            {template?.photoURL ? (
              <div className="max-w-full max-h-full flex items-center justify-center">
                <img
                  src={template.photoURL}
                  alt={template.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              </div>
            ) : (
              <div className="w-64 h-80 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-2xl">
                <MdWidgets size={64} className="text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          <div className="w-96 flex-1 bg-white dark:bg-slate-900 flex flex-col">
            <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {template?.title}
                  </DialogTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {template?.description}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Author Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <MdPerson className="w-4 h-4" />
                  Created by
                </h3>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={template?.user.photoURL} alt={template?.user.displayName} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {getInitials(template?.user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {template?.user.displayName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      @{template?.user.username}
                    </p>
                  </div>
                </div>
              </div>

              {/* Template Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Template Details
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Created Date */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <MdCalendarToday className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Created</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatDate(template?.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <MdImage className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Type</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {template?.type}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  {template?.category && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <MdCategory className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Category</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {template.category}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {template?.tags && template.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <MdTag className="w-4 h-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Template Info */}
              {template?.photoMeta && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Canvas Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Dimensions</p>
                       <p className="text-xs font-medium">
                          {canvasPresets[template.type].width} × {canvasPresets[template.type].height}
                        </p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Ratio</p>
                    <p className="text-xs font-medium">
                        {(canvasPresets[template.type].width / canvasPresets[template.type].height).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
             <CreateNewCanvas btnText="Use this Template" template={template}/>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal