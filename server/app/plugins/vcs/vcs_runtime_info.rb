module Jashboard
  module Plugin
    module Vcs
      VcsRuntimeInfo = Struct.new(:revision_id, :date, :author, :email, :message)
    end
  end
end
